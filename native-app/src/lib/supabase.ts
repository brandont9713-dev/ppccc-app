export const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
export const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabaseReady = Boolean(supabaseUrl && supabaseAnonKey);

type FunctionOptions = {
  accessToken?: string;
  body?: unknown;
};

export async function invokeSupabaseFunction<T = unknown>(name: string, options: FunctionOptions = {}) {
  if (!supabaseReady) {
    throw new Error("Supabase is not configured.");
  }

  const token = options.accessToken || supabaseAnonKey;
  const response = await fetch(`${supabaseUrl}/functions/v1/${name}`, {
    method: "POST",
    headers: {
      apikey: supabaseAnonKey,
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(options.body ?? {}),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.error || `Function ${name} failed.`);
  }

  return data as T;
}
