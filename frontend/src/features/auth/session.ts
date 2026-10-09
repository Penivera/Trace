import { z } from "zod";

export const currentUserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  avatar: z.object({ src: z.string() }),
});

export type CurrentUser = z.infer<typeof currentUserSchema>;

/**
 * MOCK signed-in player until the backend session exists. Replace with a
 * `serverApi.get("/me", currentUserSchema)` call (forwarding the session cookie).
 */
export async function getCurrentUser(): Promise<CurrentUser> {
  return {
    id: "mock-user",
    displayName: "Diva Montess",
    // Profile picture from the Figma header until users can upload their own.
    avatar: { src: "/avatars/diva-montess.jpg" },
  };
}
