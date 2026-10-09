import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Cliente anônimo, sem sessão. Usado para as leituras públicas que ficam em cache
 * (não lê cookies, então pode rodar dentro de 'use cache').
 */
export function clientePublico() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
