import math
from typing import List, Dict, Optional, Union
import numpy as np
import matplotlib.pyplot as plt

from .real_estate_property import RealEstateProperty
from .single_house_israel_model import SingleHouseIsraelModel
from ..investors.real_estate_investment_type import RealEstateInvestmentType
from ..investors.real_estate_investor import RealEstateInvestor
from ..investors.real_estate_investors_portfolio import RealEstateInvestorsPortfolio
from ..mortgage.mortgage_pipeline import MortgagePipeline
from ..mortgage.mortgage_tracks.constant_not_linked import ConstantNotLinked
from ..mortgage.mortgage_tracks.constant_linked import ConstantLinked
from ..mortgage.mortgage_tracks.change_not_linked import ChangeNotLinked
from ..mortgage.mortgage_tracks.change_linked import ChangeLinked
from ..mortgage.mortgage_tracks.eligibility import Eligibility
from ..mortgage.mortgage_tracks.prime import Prime


def get_real_estate_investment_type(real_estate_investment_type: str) -> RealEstateInvestmentType:
    try:
        final_type = None
        if real_estate_investment_type == 'single apartment':
            final_type = 'SingleApartment'
        elif real_estate_investment_type == 'alternative apartment':
            final_type = 'AlternativeApartment'
        elif real_estate_investment_type == 'additional apartment':
            final_type = 'AdditionalApartment'
        return RealEstateInvestmentType[final_type]
    except KeyError:
        raise ValueError(f"Invalid real estate investment type: {real_estate_investment_type}")


# Mortgage type to class mapping
mortgage_type_map = {
    'ConstantNotLinked': ConstantNotLinked,
    'ConstantLinked': ConstantLinked,
    'ChangeNotLinked': ChangeNotLinked,
    'ChangeLinked': ChangeLinked,
    'Eligibility': Eligibility,
    'Prime': Prime
}


class BMM(SingleHouseIsraelModel):
    def __init__(self, investment_data: Dict, investor_data: Dict, property_data: Dict, mortgage_data: Dict,
                 other_data: Dict):
        investor = RealEstateInvestor(
            net_monthly_income=investor_data['net_monthly_income'],
            total_debt_payment=investor_data['total_debt_payment'],
            real_estate_investment_type=get_real_estate_investment_type(property_data['real_estate_investment_type']),
            total_available_equity=investor_data['total_available_equity'],
            gross_rental_income=investor_data['gross_rental_income']
        )
        investors_portfolio = RealEstateInvestorsPortfolio(investor)

        property = RealEstateProperty(
            purchase_price=property_data['purchase_price'],
            monthly_rent_income=property_data['monthly_rent_income'],
            square_meters=property_data['square_meters'],
            parking_spots=property_data['parking_spots'],
            warehouse=property_data['warehouse'],
            balcony_square_meter=property_data['balcony_square_meter'],
            after_repair_value=property_data['after_repair_value'],
            annual_appreciation_percentage=property_data['annual_appreciation_percentage']
        )

        mortgage = MortgagePipeline(self.initialize_mortgages(mortgage_data))

        super().__init__(
            investors_portfolio, mortgage, property,
            years_to_exit=investment_data['years_to_exit'],
            average_interest_in_exit=None,
            mortgage_advisor_cost=investment_data['mortgage_advisor_cost'],
            appraiser_cost=investment_data['appraiser_cost'],
            lawyer_cost=investment_data['lawyer_cost'],
            escort_costs=investment_data['escort_costs'],
            additional_transaction_costs=investment_data['additional_transaction_costs'],
            renovation_expenses=investment_data['renovation_expenses'],
            furniture_cost=investment_data['furniture_cost'],
            broker_purchase_percentage=investment_data['broker_purchase_percentage'],
            broker_rent_percentage=investment_data['broker_rent_percentage'],
            broker_sell_percentage=investment_data['broker_sell_percentage'],
            vacancy_percentage=investment_data['vacancy_percentage'],
            annual_maintenance_cost_percentage=investment_data['annual_maintenance_cost_percentage'],
            annual_life_insurance_cost=investment_data['annual_life_insurance_cost'],
            annual_house_insurance_cost=investment_data['annual_house_insurance_cost'],
            equity_required_by_percentage=self.calculate_equity_percentage(property_data['purchase_price'],
                                                                           mortgage.total_initial_loan_amount),
            management_fees_percentage=investment_data['management_fees_percentage']
        )

        self.investment_data = investment_data
        self.investor_data = investor_data
        self.property_data = property_data
        self.mortgage_data = mortgage_data
        self.other_data = other_data

    def initialize_mortgages(self, mortgage_tracks: List[Dict]) -> List:
        result_list = []

        for mortgage_data in mortgage_tracks:
            mortgage_type = mortgage_data.get('mortgage_type')

            if mortgage_type == 'constant_not_linked':
                result_list.append(
                    ConstantNotLinked(
                        interest_rate=mortgage_data['interest_rate'],
                        num_payments=mortgage_data['mortgage_duration'] * 12,
                        initial_loan_amount=mortgage_data['initial_loan_amount'],
                        average_interest_when_taken=mortgage_data['interest_rate'],
                        interest_only_period=mortgage_data['interest_only_period']
                    )
                )
            elif mortgage_type == 'constant_linked':
                result_list.append(
                    ConstantLinked(
                        interest_rate=mortgage_data['interest_rate'],
                        num_payments=mortgage_data['mortgage_duration'] * 12,
                        initial_loan_amount=mortgage_data['initial_loan_amount'],
                        linked_index=mortgage_data['linked_index'],
                        average_interest_when_taken=mortgage_data['interest_rate'],
                        interest_only_period=mortgage_data['interest_only_period']
                    )
                )
            elif mortgage_type == 'change_not_linked':
                result_list.append(
                    ChangeNotLinked(
                        interest_rate=mortgage_data['interest_rate'],
                        num_payments=mortgage_data['mortgage_duration'] * 12,
                        initial_loan_amount=mortgage_data['initial_loan_amount'],
                        forecasting_interest_rate=mortgage_data['forecasting_interest_rate'],
                        interest_changing_period=mortgage_data['interest_changing_period'],
                        average_interest_when_taken=mortgage_data['interest_rate'],
                        interest_only_period=mortgage_data['interest_only_period']
                    )
                )
            elif mortgage_type == 'change_linked':
                result_list.append(
                    ChangeLinked(
                        interest_rate=mortgage_data['interest_rate'],
                        num_payments=mortgage_data['mortgage_duration'] * 12,
                        initial_loan_amount=mortgage_data['initial_loan_amount'],
                        linked_index=mortgage_data['linked_index'],
                        forecasting_interest_rate=mortgage_data['forecasting_interest_rate'],
                        interest_changing_period=mortgage_data['interest_changing_period'],
                        average_interest_when_taken=mortgage_data['interest_rate'],
                        interest_only_period=mortgage_data['interest_only_period']
                    )
                )
            elif mortgage_type == 'eligibility':
                result_list.append(
                    Eligibility(
                        interest_rate=mortgage_data['interest_rate'],
                        num_payments=mortgage_data['mortgage_duration'] * 12,
                        initial_loan_amount=mortgage_data['initial_loan_amount'],
                        linked_index=mortgage_data['linked_index'],
                        average_interest_when_taken=mortgage_data['interest_rate']
                    )
                )
            elif mortgage_type == 'prime':
                result_list.append(
                    Prime(
                        interest_rate=mortgage_data['interest_rate'],
                        num_payments=mortgage_data['mortgage_duration'] * 12,
                        initial_loan_amount=mortgage_data['initial_loan_amount'],
                        forecasting_interest_rate=mortgage_data['forecasting_interest_rate'],
                        average_interest_when_taken=mortgage_data['interest_rate'],
                        interest_only_period=mortgage_data['interest_only_period']
                    )
                )
            else:
                raise ValueError(f"Unknown mortgage type: {mortgage_type}")

        return result_list

    def calculate_equity_percentage(self, purchase_price, mortgage_amount):
        if purchase_price == 0:
            return 0
        return (purchase_price - mortgage_amount) / purchase_price

    def calculate_total_equity_needed_for_purchase(self) -> int:
        """
        Calculate the total equity needed for the property purchase.

        :return: The total equity needed for the purchase.
        """
        return super().calculate_total_equity_needed_for_purchase() + self.calculate_constructor_index_linked_compensation()

    def calculate_constructor_index_linked_compensation(self, years_until_key_reception: Optional[int] = None) -> int:
        """
        Calculate the compensation linked to the construction index.

        :param years_until_key_reception: Optional. Number of years until key reception. If not provided, uses the properties value.
        :return: The calculated compensation linked to the construction index.
        """
        if self.other_data.get('years_until_key_reception') <= 0:
            return 0
        if years_until_key_reception is None:
            years_until_key_reception = self.other_data.get('years_until_key_reception')
        if len(self.other_data['contractor_payment_distribution']) > 0:
            remain_balance_for_purchase = (1 - (self.investment_data['equity_required_by_percentage'] * int(
                self.other_data['contractor_payment_distribution'][0])) / 100) * self.property_data['purchase_price']
        else:
            remain_balance_for_purchase = 0

        # TODO: covert to consts. 0.4 is the percentage of the remain balance that is linked (by law)
        remain_balance_linked_amount = 0.4 * remain_balance_for_purchase
        return round(remain_balance_linked_amount * (
                np.power((1 + self.other_data['construction_input_index_annual_growth'] / 100),
                         years_until_key_reception) - 1), 2)

    def calculate_equity_payments(self) -> List[int]:
        """
        Calculate the equity payments over the investment period.

        :return: A list of calculated equity payments.
        """
        # Calculate equity required for house purchase
        equity_for_house_purchase = round(
            (self.equity_required_by_percentage / 100) * self.property_data['purchase_price']
        )

        # Check if contractor_payment_distribution has enough elements
        distribution_length = len(self.other_data['contractor_payment_distribution'])
        years_until_key_reception = self.other_data['years_until_key_reception']

        # Create a default distribution if the list is empty or too short
        if distribution_length < years_until_key_reception + 1:
            default_distribution = [1 / (years_until_key_reception + 1)] * (years_until_key_reception + 1)
        else:
            default_distribution = self.other_data['contractor_payment_distribution']

        # Calculate equity payments
        equity_payments = [round(equity_for_house_purchase * default_distribution[i]) for i in
                           range(years_until_key_reception + 1)]

        # Add closing costs to the first payment
        equity_payments[0] += self.calculate_closing_costs()

        # Add constructor index linked compensation to the last payment
        equity_payments[-1] += self.calculate_constructor_index_linked_compensation()

        return equity_payments

    def calculate_mortgage_remain_balance_in_exit(self) -> int:
        """
        Calculate the remaining mortgage balance at the exit.

        :return: The remaining mortgage balance at the exit.
        """
        mortgage_done = self.mortgage.get_num_of_payments() <= (self.investment_data['years_to_exit'] * 12)
        return 0 if mortgage_done else round(
            self.mortgage.get_remain_balances()[
                (self.investment_data['years_to_exit'] - self.other_data['years_until_key_reception']) * 12])

    def calculate_total_revenue(self) -> int:
        """
        Calculate the total revenue over the investment period.

        :return: The calculated total revenue.
        """
        return self.estimate_sale_price() + (
                self.investment_data['years_to_exit'] - self.other_data[
            'years_until_key_reception']) * self.calculate_annual_rent_income()

    def calculate_total_expenses(self) -> int:
        """
        Calculate the total expenses over the investment period.

        :return: The calculated total expenses.
        """
        return (self.calculate_total_equity_needed_for_purchase() +
                round((
                              self.investment_data['years_to_exit'] - self.other_data[
                          'years_until_key_reception']) * self.calculate_annual_operating_expenses()) +
                self.calculate_selling_expenses() +
                self.mortgage.calculate_total_cost_of_borrowing(
                    self.investment_data['years_to_exit'] - self.other_data['years_until_key_reception'],
                    self.average_interest_in_exit) +
                self.calculate_capital_gain_tax() +
                self.calculate_mortgage_remain_balance_in_exit())

    def calculate_annual_revenue_distribution(self) -> List[int]:
        """
        Calculate the annual revenue distribution over the investment period.

        :return: A list of annual revenue distribution.
        """
        return [0] * self.other_data['years_until_key_reception'] + \
            [self.calculate_annual_rent_income() for _ in
             range(self.investment_data['years_to_exit'] - self.other_data['years_until_key_reception'])] + \
            [self.estimate_sale_price()]

    def calculate_annual_expenses_distribution(self) -> List[float]:
        """
        Calculate the annual expenses distribution over the investment period.

        :return: A list of annual expenses distribution.
        """
        # annual_distribution_operating_expenses = [0 if i < self.other_data['years_until_key_reception']
        #                                           else self.calculate_annual_operating_expenses()
        #                                           for i in range(self.investment_data['years_to_exit'])] + [0]
        annual_distribution_operating_expenses = [0.0 if i < self.other_data['years_until_key_reception']
                                                  else float(self.calculate_annual_operating_expenses())
                                                  for i in range(self.investment_data['years_to_exit'])
                                                  ] + [0.0]

        # TODO: I assume here that the mortgage is only taken upon receiving a key, additional scenarios must be created
        # estimated_mortgage_monthly_payments = \
        #     [0] * self.other_data['years_until_key_reception'] + self.mortgage.get_annual_payments()[:(
        #             self.investment_data['years_to_exit'] - self.other_data['years_until_key_reception'])] + [0]
        estimated_mortgage_monthly_payments = (
                [0.0] * self.other_data['years_until_key_reception'] +
                [float(payment) for payment in self.mortgage.get_annual_payments()[:(
                        self.investment_data['years_to_exit'] - self.other_data['years_until_key_reception']
                )]] + [0.0]
        )

        # equity_distribution_to_property_purchase = self.calculate_equity_payments() + [0] * (
        #         self.investment_data['years_to_exit'] - self.other_data['years_until_key_reception'])
        equity_distribution_to_property_purchase = [
                                                       float(payment) for payment in self.calculate_equity_payments()
                                                   ] + [0.0] * (self.investment_data['years_to_exit'] - self.other_data[
            'years_until_key_reception'])

        # annual_distribution_expenses = [a + b + c for a, b, c in zip(equity_distribution_to_property_purchase,
        #                                                              estimated_mortgage_monthly_payments,
        #                                                              annual_distribution_operating_expenses)]
        annual_distribution_expenses = [
            float(a) + float(b) + float(c)
            for a, b, c in zip(
                equity_distribution_to_property_purchase,
                estimated_mortgage_monthly_payments,
                annual_distribution_operating_expenses
            )
        ]

        if self.average_interest_in_exit and self.average_interest_in_exit != 0:
            mortgage_early_repayment_fee = self.mortgage.calculate_early_payment_fee(
                12 * self.investment_data['years_to_exit'], self.average_interest_in_exit)
        else:
            mortgage_early_repayment_fee = self.mortgage.calculate_early_payment_fee(
                12 * self.investment_data['years_to_exit'])

        # capital_gain_tax = self.calculate_capital_gain_tax()
        # selling_expenses = self.calculate_selling_expenses()
        # mortgage_remain_balance = self.calculate_mortgage_remain_balance_in_exit()
        capital_gain_tax = float(self.calculate_capital_gain_tax())
        selling_expenses = float(self.calculate_selling_expenses())
        mortgage_remain_balance = float(self.calculate_mortgage_remain_balance_in_exit())

        annual_distribution_expenses[-1] += (
                selling_expenses + capital_gain_tax + mortgage_early_repayment_fee + mortgage_remain_balance)
        # return annual_distribution_expenses
        return [float(expense) for expense in annual_distribution_expenses]

    def get_annual_property_remain_balances(self):
        """
        Get the annual property remaining balances.

        :return: A list of annual property remaining balances.
        """
        return [self.mortgage.get_annual_remain_balances()[0]] * self.other_data['years_until_key_reception'] \
            + [round(balance) for balance in self.mortgage.get_annual_remain_balances()][
              :self.investment_data['years_to_exit'] - self.other_data['years_until_key_reception'] + 1]

    def plot_annual_irr_vs_construction_input_index_annual_growth(self):
        x_s = list(np.arange(0, 5.5, 0.5))
        y_s = []
        for x in x_s:
            self.other_data['construction_input_index_annual_growth'] = x
            y_s.append(self.calculate_annual_irr())

        plt.plot(x_s, y_s)
        plt.xlabel('Construction Input Index Annual Growth')
        plt.ylabel('Yearly IRR')
        plt.title('Yearly IRR vs Construction Input Index Annual Growth')
        for x, y in zip(x_s, y_s):
            plt.text(x, y, f'({x:.2f}%, {y :.2f}%)', ha='left', va='bottom')

        plt.legend()
        plt.show()

    def calculate_insights(self) -> Dict[str, Union[int, float]]:
        """
        Calculate various insights related to the investment model.

        :return: A dictionary containing various calculated insights.
        """
        insights = {}

        insights["Price per meter"] = self.calculate_price_per_meter()
        insights["Loan to cost"] = self.calculate_loan_to_cost()
        insights["Loan to value"] = self.calculate_loan_to_value()
        insights["Renovation expenses"] = self.calculate_total_renovation_expenses()
        insights["Purchase additional transactions cost"] = self.calculate_purchase_additional_transactions_cost()
        insights["Purchase tax"] = self.calculate_purchase_tax()
        insights["Closing costs"] = self.calculate_closing_costs()
        insights["Broker purchase cost"] = self.calculate_broker_purchase_cost()
        insights["Monthly operating expenses"] = self.calculate_monthly_operating_expenses()
        insights["Cash on cash"] = self.calculate_cash_on_cash()
        insights["Net Yearly Cash Flow"] = self.calculate_net_annual_cash_flow()
        insights["Net Monthly Cash Flow"] = self.calculate_net_monthly_cash_flow()
        annual_irr = self.calculate_annual_irr()
        insights["Yearly IRR"] = 0 if math.isnan(annual_irr) else annual_irr
        insights["Annual rent income"] = self.calculate_annual_rent_income()
        insights["ROI"] = self.calculate_roi()
        insights["Monthly NOI"] = self.calculate_monthly_noi()
        insights["Annual NOI"] = self.calculate_annual_noi()
        insights["Monthly rental property taxes"] = self.calculate_monthly_rental_property_taxes()
        insights["Annual rental property taxes"] = self.calculate_annual_rental_property_taxes()
        insights["Cap rate"] = self.calculate_annual_cap_rate()
        insights["Gross yield"] = self.calculate_annual_gross_yield()
        insights["Monthly insurances expenses"] = self.calculate_monthly_insurances_expenses()
        insights["Annual insurances expenses"] = self.calculate_annual_insurances_expenses()
        insights["Monthly maintenance and repairs"] = self.calculate_monthly_maintenance_and_repairs()
        insights["Annual maintenance and repairs"] = self.calculate_annual_maintenance_and_repairs()
        insights["Monthly vacancy cost"] = self.calculate_monthly_vacancy_cost()
        insights["Annual vacancy cost"] = self.calculate_annual_vacancy_cost()
        insights["Estimated sale price"] = self.estimate_sale_price()
        insights["Selling expenses"] = self.calculate_selling_expenses()
        insights["Sale proceeds"] = self.calculate_sale_proceeds()
        insights["Total revenue"] = self.calculate_total_revenue()
        insights["Annual revenue distribution"] = self.calculate_annual_revenue_distribution()
        insights["Annual operating expenses"] = self.calculate_annual_operating_expenses()
        insights["Annual cash flow"] = self.calculate_net_annual_cash_flow()
        insights["Mortgage remain balance in exit"] = self.calculate_mortgage_remain_balance_in_exit()
        insights["Constructor index linked compensation"] = self.calculate_constructor_index_linked_compensation()
        insights["Total expenses"] = self.calculate_total_expenses()
        insights["Equity needed for purchase"] = self.calculate_total_equity_needed_for_purchase()
        insights["Contractor payments"] = self.calculate_equity_payments()
        insights["Annual expenses distribution"] = self.calculate_annual_expenses_distribution()
        insights["Monthly property management fees"] = self.calculate_monthly_property_management_fees()
        insights["Annual property management fees"] = self.calculate_annual_property_management_fees()
        insights["Net profit"] = self.calculate_net_profit()
        insights["Capital gain tax"] = self.calculate_capital_gain_tax()

        return insights
