// drizzle.config.ts  (replace entire content)
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/domain/schema.ts',
  out: './drizzle/migrations',
  dialect: 'sqlite',
  driver: 'd1-http',  // ← changed here
  dbCredentials: {
    // For d1-http: you need Cloudflare API credentials (not wrangler.toml binding)
    // Get these from Cloudflare dashboard > Workers & Pages > Overview > API Tokens (create one with D1 Edit permissions)
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID || 'your-account-id-here',  // ← replace
    databaseId: process.env.CLOUDFLARE_DATABASE_ID || 'your-database-id-here',  // ← from wrangler d1 create
    token: process.env.CLOUDFLARE_D1_TOKEN || 'your-d1-token-here',  // ← API token
  },
  verbose: true,
});