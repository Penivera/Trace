import { z } from "zod";

export const currentUserSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  avatar: z.object({ src: z.string(), position: z.string() }),
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
    // Portrait crop of an investigator image until users can upload avatars.
    avatar: { src: "/investigators/officer2.png", position: "61% 38%" },
  };
}
