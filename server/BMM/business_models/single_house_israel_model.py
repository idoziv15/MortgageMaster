from ..investors.real_estate_investment_type import RealEstateInvestmentType
from .single_house_model import SingleHouseModel
from abc import ABC

PURCHASE_TAX_DIC = {
    RealEstateInvestmentType.SingleApartment: 0,
    RealEstateInvestmentType.AlternativeApartment: 0.08,
    RealEstateInvestmentType.AdditionalApartment: 0.08
}

SELLING_TAX_DIC = {
    RealEstateInvestmentType.SingleApartment: 0,
    RealEstateInvestmentType.AlternativeApartment: 0,
    RealEstateInvestmentType.AdditionalApartment: 0.25
}

class SingleHouseIsraelModel(SingleHouseModel, ABC):

    def calculate_broker_purchase_cost(self):
        """
        Calculate the broker purchase cost.

        :return: The calculated broker purchase cost.
        """
        return round(self.broker_purchase_percentage * self.real_estate_property.purchase_price)

    def calculate_closing_costs(self) -> int:
        """
        Calculate the total closing costs.

        :return: The calculated total closing costs.
        """
        return self.calculate_purchase_additional_transactions_cost() + \
               self.calculate_total_renovation_expenses() + \
               self.mortgage_advisor_cost + \
               self.appraiser_cost + \
               self.calculate_broker_purchase_cost() + \
               self.furniture_cost + \
               self.escort_costs + \
               self.lawyer_cost + \
               self.calculate_purchase_tax()

    def calculate_purchase_tax(self) -> int:
        """
        Calculate the purchase tax.

        :return: The calculated purchase tax.
        """
        return round(PURCHASE_TAX_DIC[
                         self.investors_portfolio.get_investors_purchase_taxes_type()] * self.real_estate_property.purchase_price)

    def calculate_monthly_rental_property_taxes(self) -> int:
        """
        Calculate the monthly rental property taxes.

        :return: The calculated monthly rental property taxes.
        """
        should_pay_rental_taxes = self.investors_portfolio.get_gross_rental_income() + self.real_estate_property.monthly_rent_income > 5000
        return round(0.1 * self.real_estate_property.monthly_rent_income) if should_pay_rental_taxes else 0

    def calculate_capital_gain_tax(self) -> int:
        """
        Calculate the capital gain tax.

        :return: The calculated capital gain tax.
        """
        tax_percentage = SELLING_TAX_DIC[self.investors_portfolio.get_investors_selling_taxes_type()]
        return self.estimate_sale_price() * tax_percentage

    def calculate_annual_insurances_expenses(self) -> int:
        """
        Calculate the annual insurance expenses.

        :return: The calculated annual insurance expenses.
        """
        return self.annual_house_insurance_cost + self.annual_life_insurance_cost

    def calculate_monthly_operating_expenses(self) -> int:
        """
        Calculate the monthly operating expenses.

        :return: The calculated monthly operating expenses.
        """
        return self.calculate_monthly_vacancy_cost() + \
               self.calculate_monthly_maintenance_and_repairs() + \
               self.calculate_monthly_insurances_expenses() + \
               self.calculate_monthly_rental_property_taxes() + \
               self.calculate_monthly_property_management_fees()

    def calculate_selling_expenses(self) -> int:
        """
        Calculate the selling expenses.

        :return: The calculated selling expenses.
        """
        # TODO - add more selling expenses
        return round(self.broker_sell_percentage * self.estimate_sale_price())

