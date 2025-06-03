from django.db import models

# Constants
PAYMENT_MODE_CHOICES = [
    ('cash', 'Cash'),
    ('upi', 'UPI'),
    ('cheque', 'Cheque'),
]

CHEQUE_STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('cleared', 'Cleared'),
    ('bounced', 'Bounced'),
]

EXPENSE_CATEGORY_CHOICES = [
    ('salary', 'Staff Salary'),
    ('rent', 'Rent'),
    ('petrol', 'Petrol'),
    ('utility', 'Utility Bills'),
    ('supplies', 'Office Supplies'),
    ('maintenance', 'Maintenance'),
    ('other', 'Other'),
]

class MedicalShop(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class ChequeDetails(models.Model):
    cheque_number = models.CharField(max_length=50)
    bank_name = models.CharField(max_length=100)
    cheque_date = models.DateField()
    status = models.CharField(max_length=10, choices=CHEQUE_STATUS_CHOICES)

    def __str__(self):
        return f"{self.cheque_number} - {self.status}"


class Income(models.Model):
    billing_number = models.CharField(max_length=5000)
    medical_shop = models.ForeignKey(MedicalShop, on_delete=models.CASCADE)
    date = models.DateField()
    medicine_list = models.TextField(blank=True, null=True)
    payment_mode = models.CharField(max_length=10, choices=PAYMENT_MODE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    cheque = models.OneToOneField(ChequeDetails, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.billing_number} - {self.medical_shop.name}"


class PartialPayment(models.Model):
    income = models.ForeignKey(Income, related_name='legacy_partial_payments', on_delete=models.CASCADE)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    date_paid = models.DateField()

    def __str__(self):
        return f"{self.income.billing_number} - Paid {self.amount_paid}"


class Expense(models.Model):
    category = models.CharField(max_length=20, choices=EXPENSE_CATEGORY_CHOICES)
    description = models.TextField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()

    def __str__(self):
        return f"{self.category} - {self.amount}"


class IncomePartialPayment(models.Model):
    income = models.ForeignKey(Income, on_delete=models.CASCADE, related_name="new_partial_payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField()
    note = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Partial payment of {self.amount} for {self.income}"
