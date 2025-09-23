// Types for Supabase Edge Functions
declare namespace Deno {
  export const env: {
    get(key: string): string | undefined
  }

  export function serve(handler: (req: Request) => Response | Promise<Response>): void
}

declare interface Request {
  method: string
  headers: Headers
}

declare var Response: {
  new (body?: string | null, init?: ResponseInit): Response
}

declare interface Headers {
  get(name: string): string | null
}
