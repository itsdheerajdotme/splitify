export interface Env {
  TRIP_KV: KVNamespace;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle CORS preflight request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);

    // 1. POST /api/share -> Create 24-hour temporary share link
    if (request.method === "POST" && url.pathname === "/api/share") {
      try {
        const body = (await request.json()) as any;
        const session = body?.session || body;

        // Basic payload validation
        if (!session || typeof session !== "object" || !session.id || !session.name || !Array.isArray(session.participants) || !Array.isArray(session.expenses)) {
          return new Response(
            JSON.stringify({ error: "Invalid Splitify session data structure." }),
            {
              status: 400,
              headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
          );
        }

        // Generate 6-character random alphanumeric code
        const shareId = Math.random().toString(36).substring(2, 8);
        const expiresAt = new Date(Date.now() + 86400 * 1000).toISOString();

        const payload = JSON.stringify({
          schemaVersion: 1,
          createdAt: new Date().toISOString(),
          expiresAt,
          session,
        });

        // Save to KV with 24 hours expiration TTL (86400 seconds)
        await env.TRIP_KV.put(shareId, payload, {
          expirationTtl: 86400,
        });

        return new Response(
          JSON.stringify({
            shareId,
            expiresAt,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      } catch (err: any) {
        return new Response(
          JSON.stringify({ error: "Failed to process share request.", details: err?.message }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
    }

    // 2. GET /api/share/:id -> Fetch shared trip session JSON
    if (request.method === "GET" && url.pathname.startsWith("/api/share/")) {
      const parts = url.pathname.split("/");
      const shareId = parts[parts.length - 1];

      if (!shareId || shareId.length < 3) {
        return new Response(
          JSON.stringify({ error: "Missing or invalid share ID." }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const rawData = await env.TRIP_KV.get(shareId);

      if (!rawData) {
        return new Response(
          JSON.stringify({ error: "Shared link has expired or does not exist." }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(rawData, {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ error: "Endpoint not found." }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  },
};
