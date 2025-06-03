from rest_framework import viewsets
from .models import MedicalShop, ChequeDetails, Income, PartialPayment, Expense
from .serializers import *
from rest_framework import generics
from .models import Expense
from .serializers import ExpenseSerializer
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from django.utils.dateparse import parse_date
from django.db.models import Sum
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Income, Expense, PartialPayment
from django.utils.dateparse import parse_date
from rest_framework.response import Response
from rest_framework import status
import io
import xlsxwriter
from reportlab.pdfgen import canvas
from django.http import HttpResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Sum
from .models import Income
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Income, IncomePartialPayment
from django.db.models import Sum
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

class MedicalShopViewSet(viewsets.ModelViewSet):
    queryset = MedicalShop.objects.all()
    serializer_class = MedicalShopSerializer

    @action(detail=False, methods=['get'])
    def search(self, request):
        query = request.query_params.get('q', '')
        if query:
            shops = MedicalShop.objects.filter(name__icontains=query)
        else:
            shops = MedicalShop.objects.none()
        serializer = self.get_serializer(shops, many=True)
        return Response(serializer.data)


class ChequeDetailsViewSet(viewsets.ModelViewSet):
    queryset = ChequeDetails.objects.all()
    serializer_class = ChequeDetailsSerializer

class PartialPaymentViewSet(viewsets.ModelViewSet):
    queryset = PartialPayment.objects.all().order_by('-date_paid')
    serializer_class = PartialPaymentSerializer

class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all() 
    serializer_class = ExpenseSerializer

    def get_queryset(self):
        queryset = Expense.objects.all()
        category = self.request.query_params.get('category')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if category:
            queryset = queryset.filter(category=category)
        if start_date:
            queryset = queryset.filter(date__gte=parse_date(start_date))
        if end_date:
            queryset = queryset.filter(date__lte=parse_date(end_date))

        return queryset

class IncomeViewSet(viewsets.ModelViewSet):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Serializer Errors:", serializer.errors)  # Debug here
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get_queryset(self):
        queryset = Income.objects.all()
        payment_mode = self.request.query_params.get('payment_mode')
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        medical_shop = self.request.query_params.get('medical_shop')

        if medical_shop:
            queryset = queryset.filter(medical_shop_id=medical_shop)
        if payment_mode:
            queryset = queryset.filter(payment_mode=payment_mode)
        if start_date:
            queryset = queryset.filter(date__gte=parse_date(start_date))
        if end_date:
            queryset = queryset.filter(date__lte=parse_date(end_date))
        return queryset

    # def get_queryset(self):
    #     queryset = Income.objects.all()
    #     try:
    #         ...
    #         return queryset
    #     except Exception as e:
    #         import traceback
    #         print("Exception in IncomeViewSet:", traceback.format_exc())
    #         raise e


       

@api_view(['GET'])
def dashboard_summary(request):
    incomes = Income.objects.all()

    valid_incomes = incomes.exclude(
        payment_mode='cheque',
    ) | incomes.filter(
        payment_mode='cheque',
        cheque__status='cleared'
    )

    total_income = sum(inc.amount for inc in valid_incomes)
    total_expense = sum(exp.amount for exp in Expense.objects.all())
    net_profit = total_income - total_expense

    return Response({
        "total_income": total_income,
        "total_expense": total_expense,
        "net_profit": net_profit,
    })


@api_view(['GET'])
def export_incomes_excel(request):
    incomes = Income.objects.select_related('medical_shop').all()

    payment_mode = request.GET.get('payment_mode')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if payment_mode:
        incomes = incomes.filter(payment_mode=payment_mode)
    if start_date:
        incomes = incomes.filter(date__gte=parse_date(start_date))
    if end_date:
        incomes = incomes.filter(date__lte=parse_date(end_date))

    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})
    worksheet = workbook.add_worksheet("Incomes")

    headers = ['Date', 'Billing Number', 'Medical Shop', 'Medicine List', 'Amount', 'Payment Mode']
    for col, h in enumerate(headers):
        worksheet.write(0, col, h)

    for row, income in enumerate(incomes, start=1):
        worksheet.write(row, 0, str(income.date))
        worksheet.write(row, 1, income.billing_number)
        worksheet.write(row, 2, income.medical_shop.name)
        worksheet.write(row, 3, income.medicine_list)
        worksheet.write(row, 4, float(income.amount))
        worksheet.write(row, 5, income.payment_mode)

    workbook.close()
    output.seek(0)

    response = HttpResponse(output.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename="income_report.xlsx"'
    return response


@api_view(['GET'])
def export_incomes_pdf(request):
    incomes = Income.objects.select_related('medical_shop').all()

    payment_mode = request.GET.get('payment_mode')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if payment_mode:
        incomes = incomes.filter(payment_mode=payment_mode)
    if start_date:
        incomes = incomes.filter(date__gte=parse_date(start_date))
    if end_date:
        incomes = incomes.filter(date__lte=parse_date(end_date))

    buffer = io.BytesIO()
    p = canvas.Canvas(buffer)
    y = 800

    p.setFont("Helvetica-Bold", 14)
    p.drawString(200, y, "Income Report")
    y -= 30

    p.setFont("Helvetica", 10)
    for income in incomes:
        line = f"{income.date} | {income.billing_number} | {income.medical_shop.name} | ₹{income.amount} | {income.payment_mode}"
        p.drawString(40, y, line)
        y -= 20
        if y < 40:
            p.showPage()
            y = 800

    p.showPage()
    p.save()
    buffer.seek(0)

    return HttpResponse(buffer, content_type='application/pdf')

@api_view(['GET'])
def export_expenses_excel(request):
    expenses = Expense.objects.all()

    category = request.GET.get('category')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if category:
        expenses = expenses.filter(category=category)
    if start_date:
        expenses = expenses.filter(date__gte=parse_date(start_date))
    if end_date:
        expenses = expenses.filter(date__lte=parse_date(end_date))

    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})
    worksheet = workbook.add_worksheet("Expenses")

    headers = ['Date', 'Category', 'Description', 'Amount']
    for col, h in enumerate(headers):
        worksheet.write(0, col, h)

    for row, expense in enumerate(expenses, start=1):
        worksheet.write(row, 0, str(expense.date))
        worksheet.write(row, 1, expense.get_category_display())
        worksheet.write(row, 2, expense.description)
        worksheet.write(row, 3, float(expense.amount))

    workbook.close()
    output.seek(0)

    response = HttpResponse(output.read(), content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename="expense_report.xlsx"'
    return response


@api_view(['GET'])
def export_expenses_pdf(request):
    expenses = Expense.objects.all()

    category = request.GET.get('category')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')

    if category:
        expenses = expenses.filter(category=category)
    if start_date:
        expenses = expenses.filter(date__gte=parse_date(start_date))
    if end_date:
        expenses = expenses.filter(date__lte=parse_date(end_date))

    buffer = io.BytesIO()
    p = canvas.Canvas(buffer)
    y = 800

    p.setFont("Helvetica-Bold", 14)
    p.drawString(200, y, "Expense Report")
    y -= 30

    p.setFont("Helvetica", 10)
    for expense in expenses:
        line = f"{expense.date} | {expense.get_category_display()} | ₹{expense.amount} | {expense.description}"
        p.drawString(40, y, line)
        y -= 20
        if y < 40:
            p.showPage()
            y = 800

    p.showPage()
    p.save()
    buffer.seek(0)

    return HttpResponse(buffer, content_type='application/pdf')

@api_view(['GET'])
def income_partial_payment_summary(request):
    billing_number = request.GET.get('billing_number')
    
    if not billing_number:
        return Response({'error': 'billing_number is required'}, status=400)

    try:
        incomes = Income.objects.filter(billing_number=billing_number)
    except Income.DoesNotExist:
        return Response({'error': 'Income not found'}, status=404)

    paid = IncomePartialPayment.objects.filter(income=income).aggregate(Sum('amount'))['amount__sum'] or 0

    return Response({
        'billing_number': billing_number,
        'amount_paid': paid,
        'amount_due': income.amount - paid
    })