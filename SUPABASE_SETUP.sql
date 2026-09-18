-- UdyamSetu Supabase Database Schema
-- Run this in Supabase SQL Editor: https://app.supabase.com/project/[YOUR-PROJECT]/sql/new

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  caste_category TEXT,
  annual_income BIGINT,
  location TEXT,
  language TEXT DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Requirements table (user's loan/education needs)
CREATE TABLE IF NOT EXISTS requirements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  need_type TEXT NOT NULL, -- 'business', 'education', 'other'
  purpose TEXT,
  project_type TEXT,
  project_cost BIGINT,
  desired_amount BIGINT,
  annual_income BIGINT,
  education_level TEXT,
  location TEXT,
  is_confirmed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schemes table
CREATE TABLE IF NOT EXISTS schemes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  scheme_type TEXT, -- 'term_loan', 'micro_finance', 'education_loan'
  min_amount BIGINT,
  max_amount BIGINT,
  interest_rate_min DECIMAL(5, 2),
  interest_rate_max DECIMAL(5, 2),
  repayment_period_months INT,
  moratorium_months INT,
  income_limit BIGINT,
  required_documents TEXT[], -- JSON array of document types
  eligible_categories TEXT[], -- JSON array
  status TEXT DEFAULT 'active', -- 'active', 'inactive'
  source TEXT,
  effective_date DATE,
  last_verified_date DATE,
  version TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partners table (Channel partners, banks, etc)
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  partner_type TEXT NOT NULL, -- 'bank', 'nbfc', 'sca', 'mfi'
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  authorization_status BOOLEAN DEFAULT TRUE,
  operational_status TEXT, -- 'active', 'inactive', 'verified_unavailable'
  supported_schemes TEXT[], -- JSON array of scheme IDs
  supported_categories TEXT[], -- JSON array
  fund_utilization_eligible BOOLEAN,
  npa_status TEXT,
  verification_date DATE,
  last_updated DATE,
  source TEXT,
  version TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User recommendations (stored scheme matching for user)
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  requirement_id UUID NOT NULL REFERENCES requirements(id) ON DELETE CASCADE,
  scheme_id UUID NOT NULL REFERENCES schemes(id),
  match_score DECIMAL(5, 2),
  match_reasons TEXT[], -- JSON array
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User documents table
CREATE TABLE IF NOT EXISTS user_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL, -- 'aadhaar', 'income_certificate', 'caste_certificate', etc
  file_path TEXT,
  verification_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Selected partners (user's selected partner for a scheme)
CREATE TABLE IF NOT EXISTS selected_partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recommendation_id UUID NOT NULL REFERENCES recommendations(id),
  partner_id UUID NOT NULL REFERENCES partners(id),
  selection_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  application_status TEXT DEFAULT 'not_started', -- 'not_started', 'submitted', 'approved', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_requirements_user_id ON requirements(user_id);
CREATE INDEX idx_recommendations_user_id ON recommendations(user_id);
CREATE INDEX idx_recommendations_scheme_id ON recommendations(scheme_id);
CREATE INDEX idx_user_documents_user_id ON user_documents(user_id);
CREATE INDEX idx_selected_partners_user_id ON selected_partners(user_id);
CREATE INDEX idx_partners_location ON partners(latitude, longitude);

-- Set up row level security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE selected_partners ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own data
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view their own requirements"
  ON requirements FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own requirements"
  ON requirements FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own requirements"
  ON requirements FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own documents"
  ON user_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents"
  ON user_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own recommendations"
  ON recommendations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own selected partners"
  ON selected_partners FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own selected partners"
  ON selected_partners FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Schemes and partners are publicly readable
CREATE POLICY "Schemes are readable by all authenticated users"
  ON schemes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Partners are readable by all authenticated users"
  ON partners FOR SELECT
  TO authenticated
  USING (true);

-- Create trigger to auto-create user_profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
