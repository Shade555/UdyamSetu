-- UdyamSetu: extensions and shared enum types.

create extension if not exists postgis with schema extensions;

do $$
begin
  create type public.app_language as enum ('en', 'hi', 'mr');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.need_type as enum ('business', 'education', 'other');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.record_status as enum ('draft', 'active', 'inactive', 'archived');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.eligibility_status as enum ('eligible', 'ineligible', 'needs_review');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.document_status as enum ('missing', 'available', 'flagged', 'verified');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.partner_status as enum ('verified_operational', 'verified_unavailable', 'not_verified');
exception when duplicate_object then null;
end $$;

do $$
begin
  create type public.sync_status as enum ('pending', 'synced', 'failed');
exception when duplicate_object then null;
end $$;