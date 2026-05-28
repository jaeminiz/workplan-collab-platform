export const googleOAuthScopes = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.events.readonly",
  "https://www.googleapis.com/auth/drive.metadata.readonly"
] as const;

export function getAllowedWorkspaceDomain() {
  return process.env.GOOGLE_WORKSPACE_DOMAIN || null;
}
