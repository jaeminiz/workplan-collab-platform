import { createClient } from "@/lib/supabase/server";

export type AuthUserSummary = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
};

export async function getCurrentUser(): Promise<AuthUserSummary | null> {
  const supabase = await createClient();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user?.email) {
    return null;
  }

  const metadata = data.user.user_metadata;
  const displayName =
    readMetadataString(metadata, "full_name") ??
    readMetadataString(metadata, "name") ??
    data.user.email.split("@")[0];

  return {
    id: data.user.id,
    email: data.user.email,
    displayName,
    avatarUrl: readMetadataString(metadata, "avatar_url")
  };
}

function readMetadataString(metadata: unknown, key: string) {
  if (!metadata || typeof metadata !== "object" || !(key in metadata)) {
    return null;
  }

  const value = (metadata as Record<string, unknown>)[key];

  return typeof value === "string" && value.length > 0 ? value : null;
}
