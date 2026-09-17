-- UdyamSetu: timestamps, Auth profile creation, RLS, and routing helper.
-- Requires 001_extensions_and_types.sql and 002_schema.sql.

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists schemes_set_updated_at on public.schemes;
create trigger schemes_set_updated_at before update on public.schemes
for each row execute function public.set_updated_at();

drop trigger if exists partners_set_updated_at on public.partners;
create trigger partners_set_updated_at before update on public.partners
for each row execute function public.set_updated_at();

drop trigger if exists user_profiles_set_updated_at on public.user_profiles;
create trigger user_profiles_set_updated_at before update on public.user_profiles
for each row execute function public.set_updated_at();

drop trigger if exists requirements_set_updated_at on public.requirements;
create trigger requirements_set_updated_at before update on public.requirements
for each row execute function public.set_updated_at();

drop trigger if exists user_documents_set_updated_at on public.user_documents;
create trigger user_documents_set_updated_at before update on public.user_documents
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'full_name', new.email))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

alter table public.user_profiles enable row level security;
alter table public.data_sources enable row level security;
alter table public.scheme_versions enable row level security;
alter table public.schemes enable row level security;
alter table public.scheme_rules enable row level security;
alter table public.document_requirements enable row level security;
alter table public.partner_versions enable row level security;
alter table public.partners enable row level security;
alter table public.partner_scheme_compatibility enable row level security;
alter table public.requirements enable row level security;
alter table public.scheme_recommendations enable row level security;
alter table public.finance_estimates enable row level security;
alter table public.user_documents enable row level security;
alter table public.partner_recommendations enable row level security;
alter table public.sync_queue enable row level security;

drop policy if exists "Anyone can view active scheme catalog" on public.scheme_versions;
create policy "Anyone can view active scheme catalog" on public.scheme_versions
  for select using (is_active = true);

drop policy if exists "Anyone can view official sources" on public.data_sources;
create policy "Anyone can view official sources" on public.data_sources
  for select using (true);

drop policy if exists "Anyone can view active schemes" on public.schemes;
create policy "Anyone can view active schemes" on public.schemes
  for select using (status = 'active');

drop policy if exists "Anyone can view active scheme rules" on public.scheme_rules;
create policy "Anyone can view active scheme rules" on public.scheme_rules
  for select using (
    exists (
      select 1 from public.schemes s
      join public.scheme_versions v on v.id = s.version_id
      where s.id = scheme_id and s.status = 'active' and v.is_active = true
    )
  );

drop policy if exists "Anyone can view active document requirements" on public.document_requirements;
create policy "Anyone can view active document requirements" on public.document_requirements
  for select using (
    exists (
      select 1 from public.schemes s
      join public.scheme_versions v on v.id = s.version_id
      where s.id = scheme_id and s.status = 'active' and v.is_active = true
    )
  );

drop policy if exists "Anyone can view partner catalog" on public.partner_versions;
create policy "Anyone can view partner catalog" on public.partner_versions
  for select using (true);

drop policy if exists "Anyone can view partner catalog records" on public.partners;
create policy "Anyone can view partner catalog records" on public.partners
  for select using (true);

drop policy if exists "Anyone can view partner compatibility" on public.partner_scheme_compatibility;
create policy "Anyone can view partner compatibility" on public.partner_scheme_compatibility
  for select using (true);

drop policy if exists "Users can view own profile" on public.user_profiles;
create policy "Users can view own profile" on public.user_profiles
  for select using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile" on public.user_profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users can view own requirements" on public.requirements;
create policy "Users can view own requirements" on public.requirements
  for select using (auth.uid() = user_id);

drop policy if exists "Users can create own requirements" on public.requirements;
create policy "Users can create own requirements" on public.requirements
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own requirements" on public.requirements;
create policy "Users can update own requirements" on public.requirements
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can delete own requirements" on public.requirements;
create policy "Users can delete own requirements" on public.requirements
  for delete using (auth.uid() = user_id);

drop policy if exists "Users can view own recommendations" on public.scheme_recommendations;
create policy "Users can view own recommendations" on public.scheme_recommendations
  for select using (
    exists (
      select 1 from public.requirements r
      where r.id = requirement_id and r.user_id = auth.uid()
    )
  );

drop policy if exists "Users can view own finance estimates" on public.finance_estimates;
create policy "Users can view own finance estimates" on public.finance_estimates
  for select using (
    exists (
      select 1
      from public.scheme_recommendations sr
      join public.requirements r on r.id = sr.requirement_id
      where sr.id = recommendation_id and r.user_id = auth.uid()
    )
  );

drop policy if exists "Users can manage own documents" on public.user_documents;
create policy "Users can manage own documents" on public.user_documents
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users can view own partner recommendations" on public.partner_recommendations;
create policy "Users can view own partner recommendations" on public.partner_recommendations
  for select using (
    exists (
      select 1 from public.requirements r
      where r.id = requirement_id and r.user_id = auth.uid()
    )
  );

drop policy if exists "Users can manage own sync queue" on public.sync_queue;
create policy "Users can manage own sync queue" on public.sync_queue
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create or replace function public.partner_search(
  search_latitude double precision,
  search_longitude double precision,
  requested_scheme_id uuid,
  max_distance_meters double precision default 100000
)
returns table (
  partner_id uuid,
  partner_name text,
  partner_type text,
  address text,
  distance_meters double precision,
  operational_status public.partner_status,
  contact_phone text,
  official_url text
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  select
    p.id,
    p.name,
    p.partner_type,
    p.address,
    extensions.st_distance(
      p.location,
      extensions.st_setsrid(extensions.st_makepoint(search_longitude, search_latitude), 4326)::extensions.geography
    ) as distance_meters,
    p.operational_status,
    p.contact_phone,
    p.official_url
  from public.partners p
  join public.partner_scheme_compatibility c on c.partner_id = p.id
  where c.scheme_id = requested_scheme_id
    and p.authorization_status = true
    and p.operational_status = 'verified_operational'
    and p.location is not null
    and extensions.st_dwithin(
      p.location,
      extensions.st_setsrid(extensions.st_makepoint(search_longitude, search_latitude), 4326)::extensions.geography,
      max_distance_meters
    )
  order by distance_meters asc;
$$;

grant execute on function public.partner_search(double precision, double precision, uuid, double precision) to authenticated;