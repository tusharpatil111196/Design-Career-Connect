# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
- **Students / job seekers (primary):** mainly looking for core mechanical and electrical engineering jobs. They register, keep a profile, search vacancies, apply, and track application status.
- **Agency staff (admins):** recruiters who manage clients, vacancies, candidates, and review applications with internal notes.

## Product Purpose
Recruitment agency portal ("Core Career Connect") with separate admin and student sides. Students find and track core-engineering roles; staff run the hiring pipeline. Success: students apply and see clear status; staff move applications through review quickly.

## Positioning
Agency-run, human-matched placement focused on mechanical and electrical core roles, not a generic open job board. (User-stated niche; exact claim wording undecided.)

## Operating Context
- Static site, no build step, hosted on GitHub Pages; open `index.html` directly.
- Backend is Supabase (Auth, Postgres with RLS, private `resumes` bucket, `create-student-account` edge function).
- Admins are promoted manually via SQL. Students self-register or are created by admins.
- Application statuses: New, In review, Interview, Offer, Rejected. Job statuses: Open, Paused, Closed. Client statuses: Active, Paused.

## Capabilities and Constraints
- Admin: dashboard counts, clients, vacancies, candidate profiles, application review with admin-only notes.
- Student: profile editing, job search, apply, status tracking. Resume URLs supported; resume file upload not wired into the UI yet.
- Product is live with real users, so real personal data is in play. RLS and escaping of user-entered text matter.
- **Resolved:** brand renamed to Core Career Connect and UI copy retargeted to mechanical/electrical engineering. Existing seed/demo data (Product Designer, UX Researcher, design clients) is still design-oriented and should be replaced separately.

## Brand Commitments
Name: "Core Career Connect" (renamed from "Design Career Connect"); tagline-style copy "Engineering careers, thoughtfully matched". Student voice: warm and encouraging. Staff voice: clear and efficient.

## Evidence on Hand
Schema and workflow in `supabase/schema.sql` and `README.md`. Seed content now lives only in the Supabase DB (the demo block was removed from `index.html`). No testimonials, client logos, or placement stats exist; do not fabricate.

## Product Principles
- Serve engineering students first; copy and examples must speak to mechanical/electrical roles.
- Status clarity: a candidate always knows where an application stands.
- Staff speed: review and update applications with minimal steps.
- Treat candidate data as sensitive; no placeholder claims presented as real.
