# UdyamSetu Progress

This is the living implementation checklist. Update task status and notes as work is completed. Keep completed decisions and validation evidence; do not mark work complete from a mockup alone.

## Status Legend

- `[x]` Completed and verified.
- `[~]` In progress or partially complete.
- `[ ]` Not started or blocked.

## Project Understanding and Setup

- [x] Locate and read `UdyamSetu_Full_Prototype_Blueprint_and_App_Working.docx`.
- [x] Record the product goal, north-star flow, architecture, trust boundaries, and MVP scope in `context.md`.
- [x] Record the confirmed technology stack: React/Vite PWA, FastAPI/Python, Supabase PostgreSQL/PostGIS, Supabase Auth/Storage, Service Worker, IndexedDB, hosted LLM/STT, Qdrant/embeddings, optional OCR, and online mapping.
- [ ] Create the Supabase project, configure environment variables, and enable PostGIS.
- [ ] Confirm the exact official scheme dataset and frozen source versions.
- [ ] Confirm the exact partner dataset, coordinates, authorization fields, and verified status fields.
- [ ] Confirm available AI, STT, embedding, OCR, and mapping providers.
- [x] Initialize the repository structure and development toolchain.

## Data and Backend

- [ ] Design the Supabase PostgreSQL/PostGIS schema for schemes, rules, parameters, partners, sources, versions, profiles, and sync state.
- [x] Add the initial Supabase SQL package with extensions, schema, indexes, RLS policies, Auth trigger, and partner search function.
- [ ] Add version-controlled verified scheme seed data.
- [ ] Add version-controlled verified partner seed data.
- [ ] Implement auditable deterministic eligibility rules.
- [ ] Implement explainable scheme ranking without fabricated percentage scores.
- [ ] Implement the deterministic finance engine and independent calculation tests.
- [ ] Implement personalized document requirements and missing-document tracking.
- [ ] Implement partner routing: authorization -> compatibility -> verified status -> geography.
- [ ] Implement freshness, source, effective-date, and version metadata.
- [x] Create the initial FastAPI application, Supabase configuration, CORS setup, and health endpoint.
- [ ] Expose domain modules through FastAPI endpoints.

## Frontend and User Journey

- [ ] Build the mobile-first PWA shell and route structure.
- [ ] Build Home, Language, Requirement, and Profile Confirmation screens.
- [ ] Build Scheme Recommendations with explicit reasons and official sources.
- [ ] Build Finance, Documents, Partner, and Official Action screens.
- [ ] Add English, Hindi, and Marathi UI/output support using one common profile schema.
- [ ] Add clear cached/live state and data freshness indicators.
- [ ] Add accessible validation and correction flows for extracted profile fields.

## AI, Offline, and Supporting Features

- [ ] Add text/voice-to-structured-profile extraction with mandatory user confirmation.
- [ ] Add grounded RAG over a curated official corpus.
- [ ] Add explanation and translation without moving authority into the LLM.
- [ ] Add Service Worker app-shell caching.
- [ ] Add IndexedDB cached rules/scheme data, saved progress, and queued sync.
- [ ] Add reconnect synchronization and stale-data handling.
- [ ] Add optional OCR consistency flags only after the core journey is stable.
- [ ] Add online directions and verified official action links.

## Validation and Demo

- [ ] Test eligible, ineligible, amount-limit, and multiple-match cases.
- [ ] Test incompatible, unavailable, and unknown-status partners.
- [ ] Test language parity for eligibility outcomes.
- [ ] Compare finance results against independent calculations.
- [ ] Test offline matching, finance, checklist, saved progress, reconnect, and refresh.
- [ ] Test stale-data and freshness messaging.
- [ ] Run the complete dairy-business demo scenario with the equivalent of INR 300,000 requested.
- [ ] Confirm the app ends at a concrete official action and never claims approval or sanction.
- [ ] Prepare SIH presentation/demo polish only after functional tests pass.

## Current Milestone

**Documentation baseline complete.** The implementation is not started in this workspace. The next blocking milestone is obtaining and freezing the official scheme and partner data required to define the exact schema, rules, routing fields, API contracts, and seeded demo data.

## Decision Log

- Rules first, AI second.
- Prototype target: React/Vite PWA + FastAPI + Supabase PostgreSQL/PostGIS + IndexedDB.
- Offline scope: core matching, cached scheme information, finance, checklist, and saved progress.
- Partner routing must not invent approval limits or unavailable operational metrics.
- OCR is optional assistance and is not authenticity verification.
- The product provides decision support and official navigation, not approval or application replacement.
