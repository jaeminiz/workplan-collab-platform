import type { User } from "@supabase/supabase-js";

import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = NonNullable<Awaited<ReturnType<typeof createClient>>>;

export async function ensureProfileForUser(supabase: SupabaseServerClient, user: User) {
  if (!user.email) {
    return;
  }

  const displayName =
    readMetadataString(user.user_metadata, "full_name") ??
    readMetadataString(user.user_metadata, "name") ??
    user.email.split("@")[0];

  const { error } = await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      display_name: displayName,
      avatar_url: readMetadataString(user.user_metadata, "avatar_url"),
      updated_at: new Date().toISOString()
    },
    { onConflict: "id" }
  );

  if (error) {
    throw new Error(error.message);
  }
}

function readMetadataString(metadata: unknown, key: string) {
  if (!metadata || typeof metadata !== "object" || !(key in metadata)) {
    return null;
  }

  const value = (metadata as Record<string, unknown>)[key];

  return typeof value === "string" && value.length > 0 ? value : null;
}
