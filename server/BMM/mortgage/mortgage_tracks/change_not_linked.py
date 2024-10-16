from .mortgage_track import MortgageTrack
from ..mortgage_utils.mortgage_financial_utils_il import calculate_early_payment_fee
from typing import List, Optional


class ChangeNotLinked(MortgageTrack):

    def __init__(self, interest_rate: float, num_payments: int, initial_loan_amount: int,
                 forecasting_interest_rate: List[float], interest_changing_period: int,
                 average_interest_when_taken: Optional[float] = None, interest_only_period: int = 0):
        super().__init__(interest_rate, num_payments, initial_loan_amount,
                         forecasting_interest_rate=forecasting_interest_rate,
                         average_interest_when_taken=average_interest_when_taken,
                         interest_only_period=interest_only_period)
        self.interest_changing_period = interest_changing_period

    def calculate_early_payment_fee(self, num_of_months: int, average_interest_in_early_payment: float):
        """
        Calculate the early payment fee.

        :param num_of_months: Number of months for which early payment is considered.
        :param average_interest_in_early_payment: Average interest rate during early payment.
        :return: The calculated early payment fee.
        """
        interest_changing_period = self.interest_changing_period
        if self.interest_changing_period != 0:
            interest_changing_period = interest_changing_period - (num_of_months % self.interest_changing_period)

        monthly_payments_without_linking = [self.calculate_initial_monthly_payment() for _ in range(self.num_payments)]
        return calculate_early_payment_fee(average_interest_in_early_payment,
                                           monthly_payments_without_linking[num_of_months:],
                                           self.interest_rate, self.average_interest_when_taken,
                                           interest_changing_period)
