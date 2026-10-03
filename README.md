# Design-Career-Connect

## Design Career Connect recruitment portal

A self-contained recruitment agency website with separate admin and student portals. Open `index.html` directly in a browser; no build step or dependencies are required.

### Demo accounts

- Admin: `admin@fieldwork.test` / `fieldwork123`
- Student: `amina@fieldwork.test` / `student123`

Use the demo buttons on the sign-in screen to enter either portal. Changes are saved in this browser with local storage. To restore the original sample data, clear this site's local storage.

### Included workflows

- Admin dashboard with vacancy, candidate, application and review counts
- Client records and vacancy creation/editing
- Candidate profiles and student portal account creation
- Application review with status updates and internal notes
- Student profile editing, job search, applications and status tracking

### Prototype security note

This is a browser-only prototype. It stores demo account passwords and personal data in local storage and does not provide server-side authentication, authorization, or a shared database. Do not use real credentials or candidate information. A production deployment needs a secure backend, password hashing, access controls, and persistent database storage.