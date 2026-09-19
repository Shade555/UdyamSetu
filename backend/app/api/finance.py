"""Finance calculation endpoints."""

from typing import Any

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from ..services.finance import FinanceError, calculate_repayment
from ..supabase_client import get_supabase

router = APIRouter(prefix="/api/emi", tags=["finance"])


class EMIRequest(BaseModel):
    scheme_id: str = Field(min_length=1)
    loan_amount: float = Field(gt=0)
    repayment_period: int = Field(gt=0)
    moratorium: int = Field(ge=0)
    repayment_frequency: str | None = None
    project_cost: float | None = Field(default=None, gt=0)
    lending_channel: str | None = None
    interest_case: str | None = None
    repayment_started: bool | None = None
    course_period_months: int | None = Field(default=None, gt=0)


class EMIResponse(BaseModel):
    scheme_id: str
    scheme_name: str
    loan_amount: float
    annual_interest_rate: float
    repayment_period_months: int
    repayment_periods: int
    repayment_frequency: str
    moratorium_months: int
    emi: float
    total_interest: float
    total_repayment: float
    schedule: list[dict[str, Any]]
    calculation_method: str
    is_official_term: bool
    assumptions: list[str]


@router.post("/calculate", response_model=EMIResponse)
def calculate_emi(request: EMIRequest) -> EMIResponse:
    try:
        result = (
            get_supabase()
            .table("schemes")
            .select(
                "code,name,max_amount,interest_rate,interest_rate_type,"
                "repayment_period_months,repayment_frequency,moratorium_months,"
                "project_conditions,education_conditions,status"
            )
            .eq("code", request.scheme_id)
            .eq("status", "active")
            .limit(1)
            .execute()
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Scheme data is currently unavailable.",
        ) from exc

    rows = result.data or []
    if not rows:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Active scheme '{request.scheme_id}' was not found.",
        )

    try:
        return calculate_repayment(rows[0], request.model_dump())
    except FinanceError as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(exc)) from exc
    except (TypeError, ValueError) as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Invalid finance input.") from exc
