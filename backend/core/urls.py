from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from .views import export_expenses_excel, export_expenses_pdf
from .views import dashboard_summary
from .views import export_incomes_excel, export_incomes_pdf, income_partial_payment_summary

router = DefaultRouter()
router.register(r'medicalshops', MedicalShopViewSet)
router.register(r'cheques', ChequeDetailsViewSet)
router.register(r'incomes', IncomeViewSet)
router.register(r'partial-payments', PartialPaymentViewSet)
router.register(r'expenses', ExpenseViewSet)

urlpatterns = [
    path('incomes/summary/', income_partial_payment_summary),
    path('', include(router.urls)),
    path('dashboard-summary/', dashboard_summary),
    path('incomes/export/excel/', export_incomes_excel),
    path('incomes/export/pdf/', export_incomes_pdf),
    path('expenses/export/excel/', export_expenses_excel),
    path('expenses/export/pdf/', export_expenses_pdf),
    path('income-partial-summary/', income_partial_payment_summary),  # FIXED
]




