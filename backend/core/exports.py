import io
import xlsxwriter
from reportlab.pdfgen import canvas
from django.http import HttpResponse
from django.utils.dateparse import parse_date
from finance.models import Income


def filter_incomes(request):
    queryset = Income.objects.select_related('medical_shop').all()
    payment_mode = request.GET.get('payment_mode')
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    medical_shop = request.GET.get('medical_shop')

    if payment_mode:
        queryset = queryset.filter(payment_mode=payment_mode)
    if start_date:
        queryset = queryset.filter(date__gte=parse_date(start_date))
    if end_date:
        queryset = queryset.filter(date__lte=parse_date(end_date))
    if medical_shop:
        queryset = queryset.filter(medical_shop__id=medical_shop)

    return queryset


def export_incomes_excel(request):
    incomes = filter_incomes(request)
    
    output = io.BytesIO()
    workbook = xlsxwriter.Workbook(output, {'in_memory': True})
    worksheet = workbook.add_worksheet()

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


def export_incomes_pdf(request):
    incomes = filter_incomes(request)

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
