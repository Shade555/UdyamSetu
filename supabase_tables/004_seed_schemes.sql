-- 1. DATA SOURCE
INSERT INTO public.data_sources (
    name,
    source_type,
    description
)
VALUES (
    'UdyamSetu Project Document',
    'official',
    'Scheme parameters provided in the UdyamSetu project document.'
)
ON CONFLICT DO NOTHING;

-- 2. SCHEME VERSION
INSERT INTO public.scheme_versions (
    version,
    effective_date,
    is_active,
    source_id
)
SELECT
    'seed-2026-09',
    CURRENT_DATE,
    TRUE,
    id
FROM public.data_sources
WHERE name = 'UdyamSetu Project Document'
ON CONFLICT (version) DO NOTHING;

-- 3. SCHEMES
INSERT INTO public.schemes (
    version_id,
    name,
    code,
    description,
    need_type,
    purposes,
    min_amount,
    max_amount,
    interest_rate,
    interest_rate_type,
    repayment_period_months,
    repayment_frequency,
    moratorium_months,
    education_conditions,
    project_conditions,
    official_terms,
    status,
    source_id
)
SELECT
    sv.id,
    s.name,
    s.code,
    s.description,
    s.need_type,
    s.purposes,
    s.min_amount,
    s.max_amount,
    s.interest_rate,
    s.interest_rate_type,
    s.repayment_period_months,
    s.repayment_frequency,
    s.moratorium_months,
    s.education_conditions,
    s.project_conditions,
    s.official_terms,
    'active'::public.record_status,
    ds.id

FROM public.scheme_versions sv

JOIN public.data_sources ds
    ON ds.name = 'UdyamSetu Project Document'

CROSS JOIN LATERAL (

    VALUES

    -- MFS
    (
        'Micro Finance Scheme (MFS)',
        'MFS',
        'Micro Finance Scheme for eligible business purposes.',
        'business'::public.need_type,
        ARRAY['business']::text[],

        NULL::numeric,
        125000::numeric,

        6.5::numeric,
        'fixed',

        36,
        'quarterly',
        3,

        NULL::jsonb,

        jsonb_build_object(
            'project_cost_max', 140000,
            'loan_amount_rule',
                'min(90% of project cost, 125000)'
        ),

        'Project cost <= Rs. 1,40,000; maximum loan min(90% of project cost, Rs. 1,25,000); 6.5% p.a.; quarterly repayment; maximum 3 years; 3-month moratorium.'
    ),

    -- TERM LOAN
    (
        'Term Loan',
        'TERM_LOAN',
        'Term Loan for eligible business/project purposes.',
        'business'::public.need_type,
        ARRAY['business']::text[],

        NULL::numeric,
        4500000::numeric,

        8.0::numeric,
        'fixed',

        84,
        'quarterly',
        6,

        NULL::jsonb,

        jsonb_build_object(
            'project_cost_min_exclusive', 140000,
            'project_cost_max', 5000000,
            'loan_amount_rule',
                'min(90% of project cost, 4500000)'
        ),

        'Project cost > Rs. 1,40,000 and <= Rs. 50,00,000; maximum loan min(90% of project cost, Rs. 45,00,000); 8% p.a.; quarterly repayment; maximum 7 years; 6-month moratorium.'
    ),

    -- AMY
    (
        'Aajeevika Micro-Finance Yojana (AMY)',
        'AMY',
        'Aajeevika Micro-Finance Yojana for eligible business purposes.',
        'business'::public.need_type,
        ARRAY['business']::text[],

        NULL::numeric,
        125000::numeric,

        15.0::numeric,
        'fixed',

        36,
        'quarterly',
        3,

        NULL::jsonb,

        jsonb_build_object(
            'project_cost_max', 140000,
            'loan_amount_rule',
                'min(90% of project cost, 125000)',
            'lender_condition',
                'Selected NBFC-MFIs'
        ),

        'Project cost <= Rs. 1,40,000; maximum loan min(90% of project cost, Rs. 1,25,000); 15% p.a.; quarterly repayment; maximum 3 years; 3-month moratorium; selected NBFC-MFIs.'
    ),

    -- UNY
    (
        'Udyam Nidhi Yojana (UNY)',
        'UNY',
        'Udyam Nidhi Yojana for eligible business purposes.',
        'business'::public.need_type,
        ARRAY['business']::text[],

        NULL::numeric,
        450000::numeric,
        NULL::numeric,
        NULL,

        60,
        'quarterly / half-yearly',
        3,

        NULL::jsonb,

        jsonb_build_object(
            'project_cost_max', 500000,
            'loan_amount_rule',
                'min(90% of project cost, 450000)',
            'interest_rates', jsonb_build_object(
                'cooperative_banks_societies', 13.0,
                'sfbs', 15.0
            ),
            'lending_channels', jsonb_build_array(
                'Cooperative Banks/Societies',
                'SFBs'
            )
        ),
        'Project cost <= Rs. 5,00,000; maximum loan min(90% of project cost, Rs. 4,50,000); 13% via Cooperative Banks/Societies and 15% via SFBs; quarterly or half-yearly repayment; maximum 5 years; 3-month moratorium.'
    ),

    -- ELS
    (
        'Educational Loan Scheme (ELS)',
        'ELS',
        'Educational Loan Scheme for eligible education purposes.',
        'education'::public.need_type,
        ARRAY['education']::text[],

        NULL::numeric,
        4000000::numeric,
        NULL::numeric,
        NULL,
        NULL,
        NULL,
        NULL,

        jsonb_build_object(
            'course_type', jsonb_build_array(
                'regular',
                'full-time',
                'professional',
                'technical'
            ),
            'recognition',
                'Recognized/approved by government',
            'location', jsonb_build_array(
                'India',
                'abroad'
            )
        ),

        jsonb_build_object(
            'maximum_support_rule',
                'min(4000000, 90% of course fee)',
            'interest_rates', jsonb_build_object(
                'beneficiary', 6.5,
                'ca', 2.5
            ),
            'repayment', jsonb_build_object(
                'course_not_started_max_years', 12,
                'course_started_max_years', 10
            ),
            'moratorium', jsonb_build_object(
                'course_not_started',
                    'course period + 1 year',
                'course_started_months',
                    6
            )
        ),

        'Maximum support min(Rs. 40,00,000, 90% of course fee); beneficiary interest 6.5% p.a.; CA interest 2.5% p.a.; repayment up to 12 years if course has not started and up to 10 years if course has started; moratorium is course period + 1 year if not started and 6 months if started.'
    )

) AS s(
    name,
    code,
    description,
    need_type,
    purposes,
    min_amount,
    max_amount,
    interest_rate,
    interest_rate_type,
    repayment_period_months,
    repayment_frequency,
    moratorium_months,
    education_conditions,
    project_conditions,
    official_terms
)
WHERE sv.version = 'seed-2026-09'

-- 4. UPDATE IF THE SEED ALREADY EXISTS
ON CONFLICT (version_id, code)
DO UPDATE SET

    name = EXCLUDED.name,
    description = EXCLUDED.description,
    need_type = EXCLUDED.need_type,
    purposes = EXCLUDED.purposes,
    min_amount = EXCLUDED.min_amount,
    max_amount = EXCLUDED.max_amount,
    interest_rate = EXCLUDED.interest_rate,
    interest_rate_type = EXCLUDED.interest_rate_type,
    repayment_period_months = EXCLUDED.repayment_period_months,
    repayment_frequency = EXCLUDED.repayment_frequency,
    moratorium_months = EXCLUDED.moratorium_months,
    education_conditions = EXCLUDED.education_conditions,
    project_conditions = EXCLUDED.project_conditions,
    official_terms = EXCLUDED.official_terms,
    status = EXCLUDED.status,
    source_id = EXCLUDED.source_id,
    updated_at = NOW();

-- 5. VERIFY
SELECT
    code,
    name,
    interest_rate,
    repayment_period_months,
    repayment_frequency,
    moratorium_months,
    max_amount,
    status
FROM public.schemes
WHERE version_id = (
    SELECT id
    FROM public.scheme_versions
    WHERE version = 'seed-2026-09'
)
ORDER BY code;