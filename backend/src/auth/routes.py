from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status
from src.auth.blacklist import TokenBlacklistService, get_blacklist_service
from src.auth.crypto import (
    generate_nonce,
    hash_password,
    is_valid_solana_address,
    verify_password,
    verify_solana_signature,
)
from src.auth.dependencies import (
    AuthenticatedContext,
    get_auth_context,
    get_auth_context_optional,
)
from src.auth.google import (
    exchange_google_code,
    get_google_auth_url,
    verify_google_id_token,
)
from src.auth.jwt import create_access_token
from src.auth.models import (
    AuthResponse,
    GoogleAuthRequest,
    GoogleAuthUrlResponse,
    LoginRequest,
    SessionResponse,
    SignupRequest,
    UserResponse,
    WalletChallengeRequest,
    WalletChallengeResponse,
    WalletVerifyRequest,
)
from src.database.storage import storage

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def signup(req: SignupRequest):
    """Register a new user with email and password, returning a JWT with TTL."""
    existing = await storage.get_user_by_email(req.email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )

    user = await storage.create_user(
        email=req.email,
        username=req.username,
        password_hash=hash_password(req.password),
    )
    token, _, ttl = create_access_token({"sub": user.id, "email": user.email})
    return AuthResponse(
        user=UserResponse(**user.to_dict()),
        token=token,
        tokenType="Bearer",
        expiresIn=ttl,
    )


@router.post("/login", response_model=AuthResponse)
async def login(req: LoginRequest):
    """Authenticate with email and password, returning a JWT with TTL."""
    user = await storage.get_user_by_email(req.email)
    if not user or not user.password_hash or not verify_password(req.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token, _, ttl = create_access_token({"sub": user.id, "email": user.email})
    return AuthResponse(
        user=UserResponse(**user.to_dict()),
        token=token,
        tokenType="Bearer",
        expiresIn=ttl,
    )


@router.post("/wallet/challenge", response_model=WalletChallengeResponse)
async def wallet_challenge(req: WalletChallengeRequest):
    """
    Generate a cryptographic challenge message for a Solana wallet.
    The wallet signs this message off-chain to prove ownership of the private key.
    """
    if not is_valid_solana_address(req.wallet):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Solana public key",
        )

    nonce = generate_nonce()
    message = (
        f"TRACE Security Authentication\n\n"
        f"Sign this message to authenticate your Solana wallet with TRACE.\n\n"
        f"Wallet: {req.wallet}\n"
        f"Nonce: {nonce}\n"
    )
    await storage.set_wallet_challenge(req.wallet, {"message": message, "nonce": nonce})
    return WalletChallengeResponse(wallet=req.wallet, message=message, nonce=nonce)


@router.post("/wallet/verify", response_model=AuthResponse)
async def wallet_verify(req: WalletVerifyRequest):
    """
    Verify the Solana Ed25519 signature and authenticate/register the wallet owner,
    returning a Bearer JWT with TTL.
    """
    if not is_valid_solana_address(req.wallet):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Solana public key",
        )

    challenge = await storage.get_wallet_challenge(req.wallet)
    if not challenge or challenge["message"] != req.message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired wallet challenge message",
        )

    # Cryptographically verify the Ed25519 signature
    is_valid = verify_solana_signature(
        wallet_address=req.wallet,
        signature_b58=req.signature,
        message=req.message,
    )
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Solana signature verification failed",
        )

    # Consume the challenge to prevent replay attacks
    await storage.remove_wallet_challenge(req.wallet)

    # Find or create user
    user = await storage.get_user_by_wallet(req.wallet)
    if not user:
        user = await storage.create_user(wallet_address=req.wallet)

    token, _, ttl = create_access_token({"sub": user.id, "wallet": user.wallet_address})
    return AuthResponse(
        user=UserResponse(**user.to_dict()),
        token=token,
        tokenType="Bearer",
        expiresIn=ttl,
    )


@router.get("/session", response_model=SessionResponse)
async def session(
    context: Annotated[AuthenticatedContext | None, Depends(get_auth_context_optional)],
):
    """Return the current session status and user data from Bearer JWT."""
    if not context:
        return SessionResponse(authenticated=False, user=None)
    return SessionResponse(authenticated=True, user=UserResponse(**context.user.to_dict()))


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(
    context: Annotated[AuthenticatedContext, Depends(get_auth_context)],
    blacklist_service: Annotated[TokenBlacklistService, Depends(get_blacklist_service)],
):
    """
    Revoke the current Bearer JWT by adding its jti to the Redis blacklist with TTL.
    """
    await blacklist_service.blacklist_token(jti=context.jti, exp_timestamp=context.exp)
    return None


@router.get("/google/url", response_model=GoogleAuthUrlResponse)
async def google_auth_url():
    """Get the Google OAuth2 consent screen URL for redirect flow."""
    return GoogleAuthUrlResponse(url=get_google_auth_url())


@router.post("/google", response_model=AuthResponse)
async def google_auth(req: GoogleAuthRequest):
    """
    Authenticate or register a user with Google Sign-In (ID Token, One Tap Credential, or Auth Code).
    Returns a Bearer JWT with TTL.
    """
    token_str = req.credential or req.idToken
    user_info = None

    if token_str:
        user_info = await verify_google_id_token(token_str)
    elif req.code:
        user_info = await exchange_google_code(req.code)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google credential, idToken, or authorization code is required",
        )

    if not user_info:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Google authentication failed or token is invalid",
        )

    email = user_info.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account did not return an email address",
        )

    # Check for existing user or create a new user
    user = await storage.get_user_by_email(email)
    if not user:
        name = user_info.get("name")
        sub = user_info.get("sub", "")
        username = name or (f"Agent_{sub[:6]}" if sub else email.split("@")[0])
        user = await storage.create_user(
            email=email,
            username=username,
        )

    token, _, ttl = create_access_token({"sub": user.id, "email": user.email})
    return AuthResponse(
        user=UserResponse(**user.to_dict()),
        token=token,
        tokenType="Bearer",
        expiresIn=ttl,
    )

