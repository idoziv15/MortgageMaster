from .mortgage_track import MortgageTrack
from ..mortgage_utils.mortgage_financial_utils_il import calculate_early_payment_fee
from typing import Optional, List

class ConstantLinked(MortgageTrack):
    def __init__(self, interest_rate: float, num_payments: int, initial_loan_amount: int, linked_index: List[float],
                  average_interest_when_taken: Optional[float] = None, interest_only_period: int = 0):
        super().__init__(interest_rate, num_payments, initial_loan_amount, linked_index=linked_index, average_interest_when_taken=average_interest_when_taken, interest_only_period=interest_only_period)

    def calculate_early_payment_fee(self, num_of_months: int, average_interest_in_early_payment: float):
        """
        Calculate the early payment fee.

        :param num_of_months: Number of months for which early payment is considered.
        :param average_interest_in_early_payment: Average interest rate during early payment.
        :return: The calculated early payment fee.
        """
        if num_of_months < 0 or average_interest_in_early_payment < 0:
            raise ValueError(f"Function arguments must be non-negative: number of months: {num_of_months}, average interest in early payment: {average_interest_in_early_payment}")
        monthly_payments_without_linking = [self.calculate_initial_monthly_payment() for _ in range(self.num_payments)]
        return calculate_early_payment_fee(average_interest_in_early_payment, monthly_payments_without_linking[num_of_months:],
                                           self.interest_rate, self.average_interest_when_taken, -1)
