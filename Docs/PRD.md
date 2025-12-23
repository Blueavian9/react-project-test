# Product Requirements Document (PRD) v1.0 for HolisticBook

## Executive Summary
HolisticBook is a lightweight, self-hosted booking platform designed specifically for holistic psychologists. It emphasizes data ownership, privacy (with a strong focus on HIPAA compliance), SEO optimization, and a serene, user-friendly experience. Building on the existing repository (https://github.com/Blueavian9/react-project-test), which is a minimal Vite + React + TypeScript + Hono + Cloudflare Workers template, this PRD refines the architecture to use Cloudflare D1 as the edge SQL database for all persistent storage and Hono on Cloudflare Workers for API and database operations.

Key enhancements from the base template:
- **HIPAA Compliance**: Implement encryption for PHI (Protected Health Information) in transit (via HTTPS) and at rest (using D1's built-in capabilities where possible; note that full HIPAA requires a Cloudflare Enterprise BAA, which should be pursued for production). Include audit logs, role-based access controls, and secure data handling to align with HIPAA Security Rule.
- **SEO Best Practices**: Incorporate server-side rendering (SSR) via Hono for key public pages (e.g., landing, booking), dynamic meta tags with React Helmet, sitemaps, robots.txt, and structured data (Schema.org for services).
- **Scalable Frontend**: Modular design following SOLID principles, with lazy loading, code splitting, and TanStack Query for efficient data fetching to ensure performance at scale.
- **Tech Stack**: Vite + React 19 (TypeScript), Hono for API/SSR, Cloudflare D1 for database. Hosted on Cloudflare Workers/Pages for edge performance (current demo: https://react-project-test.blueavian9.workers.dev/).
- **Current Repo Analysis**: The starter repo is a basic template with Vite for frontend build, React components (e.g., App.tsx with a simple counter demo), Hono for API routes, and Wrangler for Cloudflare deployment. It includes TypeScript configs, ESLint, and a minimal src/ structure (App.tsx, main.tsx, potential server.ts for Hono). No application-specific logic yet; it's a blank slate for extension. We'll build modularly on this without adding pre-commit hooks or Husky.

Target: Rapid MVP deployment with local dev via Wrangler + Vite, ensuring modularity for future scaling. Benefits include global low-latency, serverless scalability, and cost-effectiveness.

## User Stories
Refined for HIPAA, SEO, and scalability contexts.

**As a Holistic Psychologist (Practitioner):**
- I want to securely authenticate (via magic links or JWT) into a dashboard compliant with HIPAA, so only authorized users access PHI.
- I want to manage availability, session types, and view bookings stored encrypted in D1, with audit logs for changes.
- I want customizable intake forms that collect client data securely, with consent tracking for HIPAA.

**As a Client:**
- I want an account-free, SEO-optimized public booking flow to easily find and book sessions, with clear privacy notices.
- I want email confirmations and reminders that comply with HIPAA (no PHI in unsecured emails).

**As an Admin/Developer:**
- I want modular code following SOLID principles for easy extension (e.g., adding payments or analytics).
- I want SEO tools integrated for better discoverability (e.g., meta tags for "holistic psychologist booking").

## Concept Summary
- **Architecture**: Modular full-stack app with React SPA (Vite-built static assets) for dynamic UIs, Hono on Workers for API, SSR on public routes for SEO, and D1 for data. Modules separated by concern (e.g., auth module, booking module) to adhere to SOLID.
- **Data Flow**: All CRUD via Hono middleware (e.g., auth checks) → D1 with Drizzle ORM for type-safe queries. Encrypt sensitive fields (e.g., client info) using SQL encryption functions.
- **Auth**: MVP uses magic links (Resend email) with JWT sessions in D1/KV. Post-MVP: Firebase Auth integration for advanced HIPAA-aligned features.
- **Design**: Minimalist, calm UI with shadcn/ui components. Scalable via lazy-loaded routes.
- **HIPAA Alignment**: Use encrypted connections, minimal data retention, consent forms, and logging. Avoid non-compliant services; pursue Cloudflare BAA.
- **SEO**: SSR for crawlable content, React Helmet for metas, auto-generated sitemap.
- **Modularity & SOLID**: Single-responsibility components/services; interfaces for dependencies; open for extension (e.g., plugin-based forms).

## Technical Summary
**Base Setup (Extending Current Repo):**
- Start from existing Vite + React + Hono template. Add Drizzle for D1, TanStack Query, React Helmet, and shadcn/ui.
- No pre-commit hooks/Husky; rely on manual linting/ESLint runs.

**Core Tech Stack:**
- **Frontend**: React 19 + TypeScript, Vite, Tailwind CSS, shadcn/ui, TanStack Query, React Router (for modular routing), React Helmet (SEO metas).
- **Backend/API**: Hono on Workers – routes under `/api/*` and SSR for `/` paths. Use c.env.DB for D1 bindings.
- **Database**: Cloudflare D1 – schemas for practitioners, availability, bookings, forms. Use Drizzle ORM for migrations/queries. Encrypt PHI columns (e.g., via SQLCipher if supported; otherwise, app-level encryption).
- **Auth**: Magic links/JWT in MVP; Firebase post-MVP.
- **Payments**: Stripe (post-MVP).
- **Emails**: Resend + Cron Triggers for reminders (HIPAA: no PHI in body; links to secure dashboard).
- **Calendar**: date-fns + FullCalendar (modular component).
- **Deployment**: Cloudflare Pages/Workers via Wrangler. Config in wrangler.toml (add D1 binding).
- **Example Hono Route (Modular)**:
  ```ts
  // src/server/routes/availability.ts (modular export)
  import { Hono } from 'hono';
  const app = new Hono();
  app.get('/api/availability', async (c) => {
    const db = c.env.DB; // D1 binding
    const results = await db.prepare('SELECT * FROM availability WHERE practitioner_id = ?').bind(c.get('userId')).all();
    return c.json(results);
  });
  ```
- **SOLID Application**: E.g., Single Responsibility (one module per feature); Dependency Inversion (inject DB via interfaces).

**HIPAA Tech Notes**: All data in transit over HTTPS. At-rest encryption via D1 (limited; supplement with field-level crypto). Access controls in Hono middleware.

**SEO Tech**: Hono SSR handler renders React to string for public pages; include Schema.org JSON-LD.

## Development Breakdown
The project is divided into **EPICS** (high-level features). Each EPIC breaks into **PRs** (pull requests for incremental delivery), **Commits** (atomic changes), and **Sub-tasks** (detailed steps). All follow SOLID (e.g., modular files, interfaces) and avoid Husky/pre-commits.

### EPIC 1: Core Infrastructure & Setup
**Goal**: Extend repo with D1, modular structure, HIPAA basics (encryption setup), SEO foundations.

- **PR 1.1: Initialize D1 Integration & Drizzle ORM**
  - **Commits**:
    - Commit 1: Add D1 binding to wrangler.toml and create initial schema.sql.
    - Commit 2: Install Drizzle ORM and generate migrations.
    - Commit 3: Create modular DB interface (e.g., src/db/interface.ts) for Dependency Inversion.
  - **Sub-tasks**:
    - Update package.json with drizzle-orm, drizzle-kit.
    - Run `wrangler d1 create` and bind in toml.
    - Define schemas (practitioners, bookings) with encrypted fields (use TEXT for encrypted strings).
    - Test locally with `wrangler dev`.

- **PR 1.2: Modular Hono Setup with SSR for SEO**
  - **Commits**:
    - Commit 1: Create src/server/index.ts with Hono app and modular route imports.
    - Commit 2: Add SSR handler using react-dom/server for public routes.
    - Commit 3: Integrate React Helmet for dynamic metas.
  - **Sub-tasks**:
    - Install @hono/vite-ssr, react-helmet-async.
    - Structure routes: src/server/routes/[feature].ts.
    - Ensure SOLID: Routes depend on abstract services (e.g., BookingService interface).

- **PR 1.3: HIPAA Security Foundations**
  - **Commits**:
    - Commit 1: Add encryption utils (e.g., crypto-js for field-level PHI encryption).
    - Commit 2: Implement audit logging middleware in Hono.
    - Commit 3: Add privacy policy page with HIPAA notices.
  - **Sub-tasks**:
    - Create src/utils/encrypt.ts (modular, single responsibility).
    - Middleware: Log accesses to PHI endpoints.
    - Test encryption/decryption in code_execution if needed during dev.

### EPIC 2: Authentication & Dashboard
**Goal**: Secure practitioner access, HIPAA-compliant auth.

- **PR 2.1: MVP Magic Link Auth**
  - **Commits**:
    - Commit 1: Add Resend integration for emails.
    - Commit 2: Create auth routes in Hono (e.g., /api/auth/magic-link).
    - Commit 3: Store sessions in D1 with JWT.
  - **Sub-tasks**:
    - Install resend, jwt.
    - Modular: src/auth/service.ts (interface-based).
    - Ensure no PHI in emails.

- **PR 2.2: Practitioner Dashboard UI**
  - **Commits**:
    - Commit 1: Add React Router with lazy-loaded dashboard route.
    - Commit 2: Build dashboard components with shadcn/ui (e.g., AvailabilityForm).
    - Commit 3: Integrate TanStack Query for data fetching.
  - **Sub-tasks**:
    - Install react-router-dom, @tanstack/react-query, shadcn/ui.
    - Modular: src/components/dashboard/[sub].tsx.
    - Follow Open-Closed: Components extensible via props.

### EPIC 3: Booking Flow & Client Features
**Goal**: Public booking with SEO, scalable UI.

- **PR 3.1: Public Booking Pages with SSR**
  - **Commits**:
    - Commit 1: Create SSR-enabled landing and booking pages.
    - Commit 2: Add sitemap.xml and robots.txt generation.
    - Commit 3: Implement Schema.org for services.
  - **Sub-tasks**:
    - Use Hono to render React for /booking.
    - Modular: src/pages/public/[page].tsx.
    - Optimize for scale: Lazy load forms.

- **PR 3.2: Booking Logic & Intake Forms**
  - **Commits**:
    - Commit 1: Add D1 tables for bookings/forms.
    - Commit 2: Hono routes for CRUD bookings (with encryption).
    - Commit 3: Client-side form components with validation.
  - **Sub-tasks**:
    - Drizzle migrations for new schemas.
    - SOLID: BookingService class handles logic.

- **PR 3.3: Emails & Reminders**
  - **Commits**:
    - Commit 1: Set up Resend for confirmations.
    - Commit 2: Add Cron Triggers for reminders.
    - Commit 3: Ensure HIPAA: Secure links only.
  - **Sub-tasks**:
    - Configure in wrangler.toml.
    - Modular handler: src/jobs/reminders.ts.

### EPIC 4: Scalability & Optimizations
**Goal**: Ensure modularity, performance.

- **PR 4.1: Code Splitting & Lazy Loading**
  - **Commits**:
    - Commit 1: Apply React.lazy to routes/components.
    - Commit 2: Optimize Vite build for Workers.
  - **Sub-tasks**:
    - Update vite.config.ts.
    - Test bundle size.

- **PR 4.2: Testing & Monitoring**
  - **Commits**:
    - Commit 1: Add unit tests for services (Vitest).
    - Commit 2: Integrate Cloudflare observability.
  - **Sub-tasks**:
    - Install vitest.
    - Modular tests: src/tests/[module].

## MVP Scope (v0.1)
- Core infra, auth, dashboard, basic booking flow.
- HIPAA basics, SEO SSR on landing.

## Future Iterations (to v2.0)
- Firebase Auth upgrade.
- Stripe payments.
- Advanced analytics.
- Custom form builder.
- Full HIPAA audit/BAA.
