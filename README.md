# Design-Career-Connect

## Design Career Connect recruitment portal

A self-contained recruitment agency website with separate admin and student portals. Open `index.html` directly in a browser; no build step or dependencies are required.

Sign in with accounts created in Supabase Authentication. The first admin account must be promoted using the SQL below.

### Included workflows

- Admin dashboard with vacancy, candidate, application and review counts
- Client records and vacancy creation/editing
- Candidate profiles and student portal account creation
- Application review with status updates and internal notes
- Student profile editing, job search, applications and status tracking

### Supabase schema setup

1. Open the Supabase project's **SQL Editor**.
2. Run (or rerun) the SQL in `supabase/schema.sql` to create the tables, policies, storage bucket, and jobs view.
3. Create an account under **Authentication → Users**. The trigger creates its `profiles` row automatically with the `student` role.
4. To make a trusted account an admin, run this in SQL Editor, replacing the email:

	```sql
	update public.profiles
	set role = 'admin'
	where email = 'admin@example.com';
	```

The schema sets up profiles, clients, jobs, applications, admin-only application notes, row-level security, and a private `resumes` storage bucket. The existing `test` table is not modified. The app uses Supabase; add clients and vacancies through the admin portal after signing in.

### Supabase app setup

- `supabase/config.js` contains the project URL and publishable key used by the frontend. The publishable key is intended for browser use; Row Level Security protects the data. Never put the service-role key in this file.
- Deploy the candidate account function from the repository root with the Supabase CLI:

	```sh
	supabase link --project-ref ielkgslegpbqgsecfjau
	supabase functions deploy create-student-account
	```

- The function uses Supabase's server-side `SUPABASE_SERVICE_ROLE_KEY` to create Auth accounts and checks that the caller is an admin first.

### Prototype security note

The site now uses Supabase Auth and the database schema above. Review the row-level security policies and test admin and student accounts before storing real candidate data. Resume URLs are supported; uploading resumes to the private storage bucket is not wired into the UI yet.