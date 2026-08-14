# Splitify Share Worker (Cloudflare Workers + KV)

This Cloudflare Worker provides a 100% free, zero-maintenance backend for sharing Splitify trips via short 24-hour links.

## 🚀 Deployment Instructions

### 1. Install Wrangler CLI & Login
If you haven't already, log into your free Cloudflare account using Wrangler:
```bash
npx wrangler login
```

### 2. Create the KV Namespace
Run the following command inside this `worker` directory to create a KV namespace:
```bash
npx wrangler kv:namespace create TRIP_KV
```

Copy the returned `id` (e.g. `a1b2c3d4e5f6...`) and paste it into `wrangler.toml`:
```toml
kv_namespaces = [
  { binding = "TRIP_KV", id = "a1b2c3d4e5f6..." }
]
```

### 3. Deploy to Cloudflare
Deploy the Worker with one command:
```bash
npx wrangler deploy
```

Once deployed, Wrangler will print your Worker URL (e.g., `https://splitify-share-worker.<your-subdomain>.workers.dev`).

### 4. Configure Frontend Environment Variable (Optional)
In your frontend `.env` or deployment settings (Vercel/Netlify/Cloudflare Pages), set:
```env
VITE_SHARE_API_URL=https://splitify-share-worker.<your-subdomain>.workers.dev
```
