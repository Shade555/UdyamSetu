-- UdyamSetu: core relational schema.
-- Requires 001_extensions_and_types.sql.

create table if not exists public.data_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  source_type text not null default 'official',
  url text,
  description text,
  verification_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.scheme_versions (
  id uuid primary key default gen_random_uuid(),
  version text not null,
  effective_date date,
  last_verified_at timestamptz,
  is_active boolean not null default false,
  source_id uuid references public.data_sources(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (version)
);

create table if not exists public.schemes (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.scheme_versions(id) on delete restrict,
  name text not null,
  code text not null,
  description text,
  need_type public.need_type not null,
  beneficiary_categories text[] not null default '{}',
  purposes text[] not null default '{}',
  min_amount numeric(14, 2),
  max_amount numeric(14, 2),
  interest_rate numeric(7, 4),
  interest_rate_type text,
  repayment_period_months integer,
  repayment_frequency text,
  moratorium_months integer not null default 0,
  income_limit numeric(14, 2),
  min_age integer,
  max_age integer,
  education_conditions jsonb not null default '{}'::jsonb,
  project_conditions jsonb not null default '{}'::jsonb,
  official_terms text,
  status public.record_status not null default 'active',
  source_id uuid references public.data_sources(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (version_id, code),
  check (min_amount is null or min_amount >= 0),
  check (max_amount is null or max_amount >= 0),
  check (max_amount is null or min_amount is null or max_amount >= min_amount),
  check (repayment_period_months is null or repayment_period_months > 0),
  check (moratorium_months >= 0)
);

create table if not exists public.scheme_rules (
  id uuid primary key default gen_random_uuid(),
  scheme_id uuid not null references public.schemes(id) on delete cascade,
  rule_code text not null,
  rule_name text not null,
  description text not null,
  condition jsonb not null,
  failure_message text not null,
  priority integer not null default 100,
  created_at timestamptz not null default now(),
  unique (scheme_id, rule_code)
);

create table if not exists public.document_requirements (
  id uuid primary key default gen_random_uuid(),
  scheme_id uuid not null references public.schemes(id) on delete cascade,
  document_code text not null,
  document_name text not null,
  description text,
  is_optional boolean not null default false,
  accepted_formats text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (scheme_id, document_code)
);

create table if not exists public.partner_versions (
  id uuid primary key default gen_random_uuid(),
  version text not null unique,
  last_verified_at timestamptz,
  source_id uuid references public.data_sources(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  version_id uuid not null references public.partner_versions(id) on delete restrict,
  name text not null,
  partner_type text not null,
  address text,
  district text,
  state text,
  location extensions.geography(Point, 4326),
  authorization_status boolean not null default false,
  operational_status public.partner_status not null default 'not_verified',
  fund_utilization_status text,
  npa_status text,
  contact_phone text,
  contact_email text,
  official_url text,
  status_source_id uuid references public.data_sources(id) on delete restrict,
  status_verified_at timestamptz,
  status_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partner_scheme_compatibility (
  partner_id uuid not null references public.partners(id) on delete cascade,
  scheme_id uuid not null references public.schemes(id) on delete cascade,
  category text,
  verified_at timestamptz,
  source_id uuid references public.data_sources(id) on delete restrict,
  primary key (partner_id, scheme_id, category)
);

create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  language public.app_language not null default 'en',
  beneficiary_category text,
  education text,
  annual_income numeric(14, 2),
  age integer,
  location extensions.geography(Point, 4326),
  location_label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (annual_income is null or annual_income >= 0),
  check (age is null or age between 0 and 150)
);

create table if not exists public.requirements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  need_type public.need_type not null,
  purpose text not null,
  project_type text,
  project_cost numeric(14, 2),
  desired_amount numeric(14, 2),
  income numeric(14, 2),
  education text,
  beneficiary_category text,
  age integer,
  location extensions.geography(Point, 4326),
  location_label text,
  input_language public.app_language not null default 'en',
  raw_input text,
  extracted_fields jsonb not null default '{}'::jsonb,
  is_confirmed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (project_cost is null or project_cost >= 0),
  check (desired_amount is null or desired_amount >= 0),
  check (income is null or income >= 0),
  check (age is null or age between 0 and 150)
);

create table if not exists public.scheme_recommendations (
  id uuid primary key default gen_random_uuid(),
  requirement_id uuid not null references public.requirements(id) on delete cascade,
  scheme_id uuid not null references public.schemes(id) on delete restrict,
  eligibility public.eligibility_status not null,
  rank integer,
  rule_reasons jsonb not null default '[]'::jsonb,
  ranking_factors jsonb not null default '{}'::jsonb,
  evaluated_at timestamptz not null default now(),
  unique (requirement_id, scheme_id)
);

create table if not exists public.finance_estimates (
  id uuid primary key default gen_random_uuid(),
  recommendation_id uuid not null references public.scheme_recommendations(id) on delete cascade,
  principal_amount numeric(14, 2) not null,
  annual_interest_rate numeric(7, 4),
  repayment_period_months integer,
  repayment_frequency text not null,
  moratorium_months integer not null default 0,
  estimated_installment numeric(14, 2),
  total_interest numeric(14, 2),
  total_repayment numeric(14, 2),
  calculation_method text not null,
  is_official_term boolean not null default false,
  calculated_at timestamptz not null default now(),
  check (principal_amount >= 0),
  check (moratorium_months >= 0)
);

create table if not exists public.user_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  requirement_id uuid not null references public.requirements(id) on delete cascade,
  document_requirement_id uuid not null references public.document_requirements(id) on delete restrict,
  status public.document_status not null default 'missing',
  storage_path text,
  consistency_flags jsonb not null default '[]'::jsonb,
  uploaded_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (requirement_id, document_requirement_id)
);

create table if not exists public.partner_recommendations (
  id uuid primary key default gen_random_uuid(),
  requirement_id uuid not null references public.requirements(id) on delete cascade,
  recommendation_id uuid references public.scheme_recommendations(id) on delete set null,
  partner_id uuid not null references public.partners(id) on delete restrict,
  distance_meters numeric(14, 2),
  rank integer,
  routing_reasons jsonb not null default '[]'::jsonb,
  evaluated_at timestamptz not null default now(),
  unique (requirement_id, partner_id)
);

create table if not exists public.sync_queue (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  operation text not null,
  entity_type text not null,
  entity_id uuid,
  payload jsonb not null default '{}'::jsonb,
  status public.sync_status not null default 'pending',
  error_message text,
  created_at timestamptz not null default now(),
  synced_at timestamptz
);

create index if not exists schemes_need_type_idx on public.schemes (need_type);
create index if not exists schemes_status_idx on public.schemes (status);
create index if not exists scheme_rules_scheme_idx on public.scheme_rules (scheme_id, priority);
create index if not exists partners_location_idx on public.partners using gist (location);
create index if not exists partners_status_idx on public.partners (authorization_status, operational_status);
create index if not exists requirements_user_idx on public.requirements (user_id, created_at desc);
create index if not exists recommendations_requirement_idx on public.scheme_recommendations (requirement_id, rank);
create index if not exists partner_recommendations_requirement_idx on public.partner_recommendations (requirement_id, rank);
create index if not exists sync_queue_user_status_idx on public.sync_queue (user_id, status, created_at);