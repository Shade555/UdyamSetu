"""Database-driven repayment calculations for scheme finance estimates."""

from dataclasses import dataclass
from typing import Any


FREQUENCY_PERIODS_PER_YEAR = {
    "monthly": 12,
    "quarterly": 4,
    "half-yearly": 2,
}


@dataclass
class FinanceError(Exception):
    message: str

    def __str__(self) -> str:
        return self.message


def _number(value: Any, field: str) -> float:
    if value is None:
        raise FinanceError(f"Scheme data is missing {field}.")
    try:
        return float(value)
    except (TypeError, ValueError) as exc:
        raise FinanceError(f"Scheme data contains an invalid {field}.") from exc


def _frequency_key(value: str | None) -> str:
    if not value:
        raise FinanceError("Repayment frequency is not specified for this scheme.")
    normalized = value.strip().lower()
    if normalized not in FREQUENCY_PERIODS_PER_YEAR:
        raise FinanceError(f"Unsupported repayment frequency: {value}.")
    return normalized


def _scheme_context(scheme: dict[str, Any], request: dict[str, Any]) -> dict[str, Any]:
    code = scheme.get("code")
    project_conditions = scheme.get("project_conditions") or {}
    education_conditions = scheme.get("education_conditions") or {}
    interest_rates = project_conditions.get("interest_rates") or education_conditions.get("interest_rates") or {}

    if code == "UNY":
        channel = request.get("lending_channel")
        if channel not in {"Cooperative Banks/Societies", "SFBs"}:
            raise FinanceError("Select a lending channel for Udyam Nidhi Yojana.")
        rate_key = "sfbs" if channel == "SFBs" else "cooperative_banks_societies"
        annual_rate = _number(interest_rates.get(rate_key), "UNY interest rate")
    elif code == "ELS":
        interest_case = request.get("interest_case")
        if interest_case not in {"beneficiary", "ca"}:
            raise FinanceError("Select the applicable ELS interest case.")
        repayment_started = request.get("repayment_started")
        if repayment_started not in {True, False}:
            raise FinanceError("Specify whether ELS repayment has started.")
        annual_rate = _number(interest_rates.get(interest_case), "ELS interest rate")
    else:
        annual_rate = _number(scheme.get("interest_rate"), "interest rate")

    frequency = _frequency_key(request.get("repayment_frequency") or scheme.get("repayment_frequency"))
    return {
        "annual_rate": annual_rate,
        "frequency": frequency,
        "periods_per_year": FREQUENCY_PERIODS_PER_YEAR[frequency],
        "project_conditions": project_conditions,
        "education_conditions": education_conditions,
    }


def calculate_repayment(scheme: dict[str, Any], request: dict[str, Any]) -> dict[str, Any]:
    scheme_id = scheme.get("code")
    loan_amount = float(request.get("loan_amount") or 0)
    repayment_period = int(request.get("repayment_period") or 0)
    moratorium = int(request.get("moratorium") or 0)

    if loan_amount <= 0:
        raise FinanceError("Loan amount must be greater than zero.")
    if repayment_period <= 0:
        raise FinanceError("Repayment period must be greater than zero.")
    if moratorium < 0:
        raise FinanceError("Moratorium cannot be negative.")

    max_amount = scheme.get("max_amount")
    if max_amount is not None and loan_amount > float(max_amount):
        raise FinanceError(f"Loan amount exceeds the scheme limit of {max_amount}.")

    project_cost = request.get("project_cost")
    project_conditions = scheme.get("project_conditions") or {}
    if project_cost is not None:
        project_cost = float(project_cost)
        if project_cost <= 0:
            raise FinanceError("Project cost/course fee must be greater than zero.")
        if project_conditions.get("project_cost_max") is not None and project_cost > float(project_conditions["project_cost_max"]):
            raise FinanceError("Project cost exceeds the scheme limit.")
        if project_conditions.get("project_cost_min_exclusive") is not None and project_cost <= float(project_conditions["project_cost_min_exclusive"]):
            raise FinanceError("Project cost does not meet the scheme minimum.")
        if loan_amount > project_cost * 0.9:
            raise FinanceError("Loan amount cannot exceed 90% of the project cost/course fee.")

    context = _scheme_context(scheme, request)
    education_conditions = context["education_conditions"]
    education_repayment = education_conditions.get("repayment") or {}
    stored_period = scheme.get("repayment_period_months")
    if scheme_id == "ELS":
        stored_period = (
            education_repayment.get("course_started_max_years", 0) * 12
            if request.get("repayment_started") is True
            else education_repayment.get("course_not_started_max_years", 0) * 12
        )
    if stored_period is not None and repayment_period > int(stored_period):
        raise FinanceError(f"Repayment period cannot exceed {stored_period} months.")
    if moratorium > repayment_period:
        raise FinanceError("Moratorium cannot exceed the repayment period.")

    stored_moratorium = scheme.get("moratorium_months")
    if stored_moratorium is not None and scheme_id != "ELS" and moratorium > int(stored_moratorium):
        raise FinanceError(f"Moratorium cannot exceed {stored_moratorium} months for this scheme.")
    if scheme_id == "ELS":
        expected_moratorium = 6 if request.get("repayment_started") is True else request.get("course_period_months")
        if expected_moratorium is None:
            raise FinanceError("Course period is required when ELS repayment has not started.")
        if request.get("repayment_started") is not True:
            expected_moratorium = int(expected_moratorium) + 12
        if moratorium != expected_moratorium:
            raise FinanceError(f"ELS moratorium must be {expected_moratorium} months for the selected repayment status.")

    months_per_period = 12 // context["periods_per_year"]
    if repayment_period % months_per_period != 0:
        raise FinanceError(
            f"Repayment period must be divisible into complete {context['frequency']} periods."
        )
    periods = repayment_period // months_per_period
    periodic_rate = context["annual_rate"] / 100 / context["periods_per_year"]
    installment = loan_amount / periods if periodic_rate == 0 else (
        loan_amount * periodic_rate * (1 + periodic_rate) ** periods
        / ((1 + periodic_rate) ** periods - 1)
    )

    balance = loan_amount
    schedule = []
    for period in range(1, periods + 1):
        interest = balance * periodic_rate
        principal = min(installment - interest, balance)
        balance = max(0.0, balance - principal)
        schedule.append({
            "period": period,
            "date": None,
            "payment": round(principal + interest, 2),
            "principal": round(principal, 2),
            "interest": round(interest, 2),
            "remaining_balance": round(balance, 2),
        })

    total_repayment = sum(row["payment"] for row in schedule)
    return {
        "scheme_id": scheme_id,
        "scheme_name": scheme.get("name"),
        "loan_amount": round(loan_amount, 2),
        "annual_interest_rate": context["annual_rate"],
        "repayment_period_months": repayment_period,
        "repayment_periods": periods,
        "repayment_frequency": context["frequency"],
        "moratorium_months": moratorium,
        "emi": round(installment, 2),
        "total_interest": round(total_repayment - loan_amount, 2),
        "total_repayment": round(total_repayment, 2),
        "schedule": schedule,
        "calculation_method": "standard_amortization",
        "is_official_term": False,
        "assumptions": [
            "Moratorium delays the first payment; interest is not capitalized because the project document does not specify moratorium-interest treatment."
        ],
    }
