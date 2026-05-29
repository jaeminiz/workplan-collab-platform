import type { User } from "@supabase/supabase-js";

import type { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseServerClient } from "@/lib/supabase/server";

type SupabaseServerClient = NonNullable<Awaited<ReturnType<typeof createClient>>>;

export type ProfileOption = {
  id: string;
  displayName: string;
  email: string;
};

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

export async function listProfilesFromSupabase() {
  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return null;
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, display_name, email")
    .order("display_name", { ascending: true });

  if (error || !data) {
    return null;
  }

  return data.map<ProfileOption>((profile) => ({
    id: profile.id as string,
    displayName: profile.display_name as string,
    email: profile.email as string
  }));
}

function readMetadataString(metadata: unknown, key: string) {
  if (!metadata || typeof metadata !== "object" || !(key in metadata)) {
    return null;
  }

  const value = (metadata as Record<string, unknown>)[key];

  return typeof value === "string" && value.length > 0 ? value : null;
}
