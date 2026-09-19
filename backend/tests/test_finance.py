import unittest

from app.services.finance import FinanceError, calculate_repayment


BASE = {
    "name": "Test Scheme",
    "code": "MFS",
    "max_amount": 125000,
    "interest_rate": 6.5,
    "repayment_period_months": 36,
    "repayment_frequency": "quarterly",
    "moratorium_months": 3,
    "project_conditions": {"project_cost_max": 140000},
    "education_conditions": {},
}


class FinanceTests(unittest.TestCase):
    def test_mfs_quarterly_calculation_reaches_zero(self):
        result = calculate_repayment(BASE, {
            "scheme_id": "MFS",
            "loan_amount": 100000,
            "repayment_period": 36,
            "moratorium": 3,
            "project_cost": 120000,
        })
        self.assertEqual(result["repayment_frequency"], "quarterly")
        self.assertAlmostEqual(result["schedule"][-1]["remaining_balance"], 0, places=2)
        self.assertGreater(result["total_interest"], 0)

    def test_term_loan_uses_stored_terms(self):
        scheme = {**BASE, "code": "TERM_LOAN", "name": "Term Loan", "max_amount": 4500000,
                  "interest_rate": 8, "repayment_period_months": 84,
                  "moratorium_months": 6,
                  "project_conditions": {"project_cost_min_exclusive": 140000, "project_cost_max": 5000000}}
        result = calculate_repayment(scheme, {
            "scheme_id": "TERM_LOAN", "loan_amount": 1000000, "repayment_period": 84,
            "moratorium": 6, "project_cost": 2000000,
        })
        self.assertEqual(result["annual_interest_rate"], 8)
        self.assertEqual(result["repayment_frequency"], "quarterly")
        self.assertEqual(result["repayment_periods"], 28)
        self.assertEqual(len(result["schedule"]), 28)
        self.assertAlmostEqual(result["schedule"][-1]["remaining_balance"], 0, places=2)
        self.assertAlmostEqual(
            sum(row["principal"] for row in result["schedule"]),
            1000000,
            places=1,
        )

    def test_amy_calculation(self):
        scheme = {**BASE, "code": "AMY", "name": "AMY", "interest_rate": 15}
        result = calculate_repayment(scheme, {
            "scheme_id": "AMY", "loan_amount": 100000, "repayment_period": 36,
            "moratorium": 3, "project_cost": 120000,
        })
        self.assertEqual(result["annual_interest_rate"], 15)

    def test_uny_requires_channel_and_uses_channel_rate(self):
        scheme = {**BASE, "code": "UNY", "name": "UNY", "max_amount": 450000,
                  "interest_rate": None, "repayment_period_months": 60,
                  "repayment_frequency": "quarterly / half-yearly", "moratorium_months": 3,
                  "project_conditions": {"project_cost_max": 500000,
                    "interest_rates": {"cooperative_banks_societies": 13, "sfbs": 15}}}
        with self.assertRaises(FinanceError):
            calculate_repayment(scheme, {"scheme_id": "UNY", "loan_amount": 100000,
                                         "repayment_period": 60, "moratorium": 3})
        result = calculate_repayment(scheme, {"scheme_id": "UNY", "loan_amount": 100000,
                                              "repayment_period": 60, "moratorium": 3,
                                              "lending_channel": "SFBs",
                                              "repayment_frequency": "half-yearly"})
        self.assertEqual(result["annual_interest_rate"], 15)
        self.assertEqual(result["repayment_frequency"], "half-yearly")

    def test_els_requires_frequency_and_context(self):
        scheme = {**BASE, "code": "ELS", "name": "ELS", "max_amount": 4000000,
                  "interest_rate": None, "repayment_period_months": None,
                  "repayment_frequency": None, "moratorium_months": None,
                  "project_conditions": {"interest_rates": {"beneficiary": 6.5, "ca": 2.5},
                                          "repayment": {"course_not_started_max_years": 12}},
                  "education_conditions": {}}
        with self.assertRaisesRegex(FinanceError, "frequency"):
            calculate_repayment(scheme, {"scheme_id": "ELS", "loan_amount": 100000,
                                         "repayment_period": 120, "moratorium": 12,
                                         "interest_case": "beneficiary", "repayment_started": False})

    def test_invalid_amount_is_rejected(self):
        with self.assertRaisesRegex(FinanceError, "exceeds"):
            calculate_repayment(BASE, {"scheme_id": "MFS", "loan_amount": 200000,
                                       "repayment_period": 36, "moratorium": 3})


if __name__ == "__main__":
    unittest.main()
