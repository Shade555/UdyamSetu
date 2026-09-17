# UdyamSetu Project Context

## Purpose of This File

This file is the shared operating context for all AI agents and developers working on UdyamSetu. Read it before making implementation decisions. Keep it updated when an architectural or product decision changes.

## Product Summary

UdyamSetu is an AI-assisted, rule-driven decision-support and navigation application for SC beneficiaries. It helps a person move from a financing or education need to an understandable, actionable path:

**Need -> Understand -> Eligibility -> Scheme -> Finance -> Documents -> Partner -> Official Action**

The product does not replace an official application process or a final lending decision. It explains options and prepares the user for the official next step.

## Core Principles

- Rules and verified official data decide eligibility; AI never silently decides eligibility.
- Financial calculations are deterministic and independently testable; they are estimates unless explicitly marked as official terms.
- AI is used for natural-language understanding, speech/text extraction, translation, explanation, and grounded Q&A over curated official sources.
- Unknown data must be displayed as unavailable or requiring verification. Never infer, fabricate, or guess.
- Partner suitability is more important than simple proximity: authorization, scheme compatibility, verified status, then geography.
- The core decision-support journey must remain useful under poor connectivity using cached data.
- One common structured profile and one rules engine serve all languages.
- Every official parameter should retain its source, version, effective date, and verification date.

## North-Star User Flow

1. Home: choose Business/Entrepreneurship, Education, or another supported need.
2. Language: choose English, Hindi, or Marathi initially.
3. Requirement: enter or speak purpose, project type, cost, desired loan, income, education, and location.
4. Confirmation: review and correct fields extracted from text or voice.
5. Scheme Match: run deterministic eligibility rules and rank suitable schemes with explicit reasons.
6. Finance: show scheme parameters and deterministic repayment estimates.
7. Documents: show the personalized required, available, and missing document checklist.
8. Partner: filter and rank authorized, compatible, verified partners by geography.
9. Action: show the verified official application or information route, contact details, and directions.

## Functional Architecture

```text
React/Vite PWA
  -> form, multilingual UI, calculator, checklist, cached state
  -> text/voice assistance for structured field extraction
FastAPI/Python backend
  -> profile, scheme rules, ranking, finance, documents, partners, sync
Supabase
  -> hosted PostgreSQL, PostGIS, Auth, and Storage
  -> schemes, rules, parameters, partners, coordinates, sources, versions
Supporting services
  -> Qdrant/embeddings for grounded RAG
  -> Tesseract or approved OCR API for optional consistency checks
  -> mapping service for online directions
  -> secure document storage
Official sources and authorized datasets
  -> source references, versioned ingestion, official next actions
```

## Technology Stack

### MVP stack

- Frontend: React with Vite, mobile-first Progressive Web App.
- Backend: Python with FastAPI.
- Database/platform: Supabase with hosted PostgreSQL.
- Spatial queries: PostGIS enabled in Supabase.
- Authentication and file storage: Supabase Auth and Supabase Storage when persistence is introduced.
- Offline: Service Worker plus IndexedDB for cached data, saved progress, and queued sync actions.
- AI/NLP: hosted LLM and STT/NLP provider selected according to hackathon access and reliability.
- RAG: Qdrant with embeddings over a small curated official corpus.
- OCR: Tesseract or an approved OCR API; assistance only, not authenticity verification.
- Maps: online mapping/directions provider; do not build full offline maps for the MVP.
- Data: version-controlled official scheme and partner datasets/data adapters.

### Non-functional requirements

- Mobile-first and usable on low bandwidth.
- Auditable eligibility decisions with recorded rule reasons.
- Deterministic, independently testable finance functions.
- Freshness/version indicators for cached and official data.
- Authentication/authorization for saved profiles and documents when persistence is introduced.
- Encryption in transit and protection of stored documents.
- Do not send user documents to unrelated AI services.

## Domain Modules

### 1. Common structured profile

Normalize form, text, and voice input into one schema containing, as applicable: need, purpose, project type, project cost, desired loan amount, income, education, beneficiary/category information, age, location, and language. The user must confirm extracted values before decisions are run.

### 2. Scheme data and rules engine

Scheme records should support: name, beneficiary category, purpose, minimum/maximum project or loan amount, interest rate, moratorium, repayment period/frequency, income requirements, age requirements, education/project conditions, required documents, partner/category compatibility, official source, effective date, last verified date, and version.

Eligibility should evaluate beneficiary/category, purpose/project, amount limits, income, education, age, and other scheme conditions. Return eligible/ineligible plus human-readable rule reasons. Ranking should consider amount fit, project/education compatibility, loan type, benefits/conditions, moratorium, repayment terms, and suitable partner availability. Do not display fake percentage match scores.

### 3. Finance engine

Inputs: selected scheme, loan amount, interest rate, repayment period, repayment frequency, and moratorium. Outputs: estimated repayment/EMI where appropriate, total interest, total repayment, and a plain-language explanation. Keep official scheme parameters separate from calculated estimates. For non-monthly schemes, show official frequency and terms instead of pretending every scheme has a monthly EMI. Handle moratorium according to the stored scheme terms.

### 4. Document readiness

Generate a personalized checklist from scheme requirements and track available/missing documents. Optional OCR may identify consistency flags. OCR does not authenticate caste, income, or other certificates. Final verification remains with the official process or authorized partner.

### 5. Partner router

Partner records should include name, type, address, latitude/longitude, supported schemes/categories, authorization status, operational status when official, fund-utilization eligibility when official, NPA/overdue status only when official, official source, verification date, and freshness/version.

Routing order: authorized -> scheme/category compatible -> operational status verified -> fund/NPA condition only if official data exists -> geographic ranking. A verified unavailable partner must not be routed as active. Unknown status must say `Not verified - confirm`; unavailable fields must say `Not available / Verify with partner`. Never invent a universal partner approval or capacity limit.

### 6. AI and RAG boundaries

AI may extract fields, translate, explain rule results, and answer questions using a curated official corpus. RAG answers must be grounded in source material. AI must not determine official eligibility, calculate finance outputs, invent partner status, claim sanction/approval, or authenticate documents.

### 7. Multilingual behavior

Initial languages: English, Hindi, Marathi. All language inputs normalize into the same structured profile and use the same rule engine. Results and explanations are rendered in the selected language. Do not create language-specific eligibility logic.

### 8. Offline and synchronization

Offline-capable: basic profile entry, cached scheme data/rules, core matching, finance, document checklist, saved progress, and queued actions. Connectivity-required: latest updates, live partner status, live maps/directions, online AI/RAG, and official online submission.

Use a Service Worker for the app shell and IndexedDB for structured cached data and saved progress. Show cache freshness and version. On reconnect, sync queued state, refresh verified data, and re-enable live functions.

## Proposed Repository Structure

This is the target structure; create directories only as implementation begins:

```text
frontend/
  src/
    components/
    features/
      onboarding/
      schemes/
      finance/
      documents/
      partners/
    i18n/
    offline/
    api/
backend/
  app/
    api/
    domain/
      profiles/
      schemes/
      finance/
      documents/
      partners/
    db/
    services/
  tests/
data/
  schemes/
  partners/
  sources/
  seeds/
docs/
tests/
```

Keep domain logic independent from HTTP handlers and UI. The rule engine and finance engine should be callable directly in tests.

## Data Governance

- Freeze the official scheme and partner sources used for each demo version.
- Version records instead of silently overwriting historical values.
- Attach source references to scheme parameters.
- Store partner verification timestamp and source.
- Display freshness to users so cached data is not mistaken for live data.
- Never claim a live NSFDC partner NPA or fund-utilization API unless an authorized feed exists. For the MVP, use a verified, version-controlled dataset or data adapter.

## 36-Hour MVP Boundary

### In scope

- Deterministic scheme matching and explanations.
- Deterministic finance calculator.
- Verified partner dataset and PostGIS-compatible routing.
- English/Hindi/Marathi UI.
- Document checklist and missing-document tracking.
- Small official RAG corpus.
- Cached core journey and saved progress.
- Online map/directions and official action links.

### Defer

- Custom ML recommendation model.
- NPA or loan approval prediction.
- Blockchain.
- Complex microservices.
- Full offline maps.
- All Indian languages.
- Full document authenticity verification.
- Unverified live government APIs.
- Analytics dashboards before core functionality.

## Development Order

1. Lock official scheme and partner data.
2. Create the Supabase PostgreSQL/PostGIS schema and seed verified prototype data.
3. Implement and test the rule-based recommender.
4. Implement and test the deterministic finance engine.
5. Implement document checklist and tracking.
6. Implement partner router.
7. Expose modules through FastAPI APIs.
8. Build the end-to-end PWA journey.
9. Add multilingual UI and output.
10. Add AI/NLP extraction and explanation.
11. Add offline cache and queued sync.
12. Add voice and OCR only after the core journey is stable.
13. Run edge-case and offline/reconnect tests.
14. Polish the SIH demo only after functional validation.

## Acceptance Tests

- Eligible entrepreneur receives the correct scheme and explicit reasons.
- Ineligible user receives a clear rejection reason.
- Amount above a scheme limit is explained, with alternatives where applicable.
- Multiple eligible schemes have deterministic, explainable ranking.
- A closer but incompatible partner is excluded.
- A verified unavailable partner is not recommended.
- Unknown partner status is shown as not verified, never guessed.
- Different languages produce the same underlying eligibility result.
- Finance output matches an independently verified calculation.
- Cached matching, finance, and checklist work offline.
- Queued state syncs and data refreshes after reconnect.
- Stale data has visible freshness information.

## Demo Scenario

An SC entrepreneur wants the equivalent of INR 300,000 for a dairy business. The user selects a language, enters or speaks the requirement, confirms extracted fields, receives a rules-based scheme recommendation, reviews finance estimates, checks missing documents, and is routed to a suitable authorized partner. A closer incompatible partner is excluded. The internet is disabled to demonstrate cached matching, finance, and checklist behavior, then restored for sync and the verified official next action.

## Open Decisions

- Exact scheme dataset and official source versions for the prototype.
- Exact partner dataset, coordinates, and verified status fields.
- Frontend stack details if the team already has an established preference beyond React/Vite.
- AI, STT, and embedding providers available during the hackathon.
- Authentication and document-storage approach for saved documents.
