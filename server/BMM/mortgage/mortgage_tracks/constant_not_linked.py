from .mortgage_track import MortgageTrack
from ..mortgage_utils.mortgage_financial_utils_il import calculate_early_payment_fee
from typing import Optional


class ConstantNotLinked(MortgageTrack):
    def __init__(self, interest_rate: float, num_payments: int, initial_loan_amount: int,
                 average_interest_when_taken: Optional[float] = None, interest_only_period: int = 0):
        super().__init__(interest_rate, num_payments, initial_loan_amount,
                         average_interest_when_taken=average_interest_when_taken,
                         interest_only_period=interest_only_period)

    def calculate_early_payment_fee(self, num_of_months: int, average_interest_in_early_payment: float) -> int:
        """
        Calculate the early payment fee.

        :param num_of_months: Number of months for which early payment is considered.
        :param average_interest_in_early_payment: Average interest rate during early payment.
        :return: The calculated early payment fee.
        """
        if isinstance(average_interest_in_early_payment, dict):
            interest_rate = average_interest_in_early_payment.get(num_of_months, 0.0)
        else:
            interest_rate = average_interest_in_early_payment
        if num_of_months < 0 or interest_rate < 0:
            raise ValueError(
                f"Function arguments must be non-negative: number of months: {num_of_months},"
                f"average interest in early payment: {average_interest_in_early_payment}")
        return calculate_early_payment_fee(interest_rate,
                                           self.get_monthly_payments()[num_of_months:],
                                           self.interest_rate, self.average_interest_when_taken, -1)
