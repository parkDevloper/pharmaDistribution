from django.contrib import admin
from .models import MedicalShop, ChequeDetails, Income, PartialPayment, Expense

admin.site.register(MedicalShop)
admin.site.register(ChequeDetails)
admin.site.register(Income)
admin.site.register(PartialPayment)
admin.site.register(Expense)
