# UdyamSetu Supabase Schema

Run the SQL files in the Supabase SQL Editor in this order:

1. `001_extensions_and_types.sql`
2. `002_schema.sql`
3. `003_security_and_functions.sql`

The files are safe to run again where practical because they use `IF NOT EXISTS`. Review any existing tables before rerunning them in a shared database.

## What is included

- PostGIS for partner location queries.
- Versioned official sources and scheme data.
- Deterministic scheme rules stored as auditable JSON conditions.
- User profiles, requirements, recommendations, finance estimates, and document readiness.
- Authorized partner records and scheme/category compatibility.
- Row Level Security for user-owned records.
- A profile trigger for new Supabase Auth users.
- A geographic partner search function that excludes unauthorized or verified-unavailable partners.

## Important setup notes

- Replace placeholder scheme and partner data with verified official datasets before using the app.
- Keep `SUPABASE_SERVICE_KEY` only in the backend environment. Never expose it in frontend code.
- The `partner_search` function does not infer unknown status as active.
- `finance_estimates` stores calculated estimates separately from official scheme parameters.
- RLS is enabled for application tables. The FastAPI backend can use the Supabase service role for trusted server-side operations; never send that key to the browser.
