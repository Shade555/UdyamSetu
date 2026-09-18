# Fix: ERR_NAME_NOT_RESOLVED Error

This error means the Supabase database tables don't exist yet.

## Quick Fix (3 steps)

### 1. Open Supabase SQL Editor
- Go to: https://app.supabase.com
- Find your project: `xghtqvwxdgbjmkfumuee`
- Click "SQL Editor" in left menu
- Click "New query"

### 2. Copy and Paste SQL
- Open: `SUPABASE_SETUP.sql` (in repo root)
- Copy ALL the SQL code
- Paste into Supabase SQL Editor
- Click "Run"

### 3. Seed Demo Data (optional but recommended)

After SQL runs, go to "SQL Editor" again and run:

```sql
-- Insert demo scheme
INSERT INTO schemes (name, scheme_type, min_amount, max_amount, interest_rate_min, interest_rate_max, repayment_period_months, moratorium_months, status, source)
VALUES (
  'Prime Minister MUDRA Yojana',
  'micro_finance',
  50000,
  1000000,
  7.5,
  12,
  60,
  3,
  'active',
  'Government of India'
);

-- Insert demo partner
INSERT INTO partners (name, partner_type, address, latitude, longitude, authorization_status, operational_status, phone, email)
VALUES (
  'State Bank of India - Pune',
  'bank',
  'SBI Main Branch, Pune, Maharashtra',
  18.5204,
  73.8567,
  TRUE,
  'active',
  '+91-20-2612-1234',
  'contact@sbi.co.in'
);
```

---

## Now Test

1. **Refresh the browser**: http://localhost:5174
2. **Try signing up again** - should work now
3. **Check for the blue chatbot button** - should appear

---

## If Still Getting Error

**Verify Supabase Connection:**
- Open browser DevTools: F12
- Go to "Network" tab
- Try signing up
- Look for failed requests
- Check if URL is: `https://xghtqvwxdgbjmkfumuee.supabase.co`

**If URL is different:**
- Update `.env` with correct Supabase URL and key
- These come from: https://app.supabase.com/project/[YOUR-PROJECT]/settings/api

---

## Done!

Once tables are created, everything should work:
- ✅ Sign up
- ✅ Sign in
- ✅ Chatbot
- ✅ Dashboard

Questions? Check browser console (F12) for detailed errors.
