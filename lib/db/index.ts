import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let _sql: NeonQueryFunction<false, false> | null = null;

export function getSQL() {
  if (!_sql) {
    if (!process.env.DATABASE_URL) {
      throw new Error(
        "DATABASE_URL environment variable is not set. Add it to your Vercel project settings."
      );
    }
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

// Backwards-compatible lazy proxy — calling sql`...` or sql(...) works exactly like before,
// but the neon() connection is only created on first actual use (at runtime, not build time).
export const sql: NeonQueryFunction<false, false> = new Proxy(
  (() => {}) as unknown as NeonQueryFunction<false, false>,
  {
    apply(_target, _thisArg, args) {
      const fn = getSQL();
      return (fn as any)(...args);
    },
    get(_target, prop) {
      const fn = getSQL();
      return (fn as any)[prop];
    },
  }
);
