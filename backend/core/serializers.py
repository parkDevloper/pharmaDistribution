from rest_framework import serializers
from .models import MedicalShop, ChequeDetails, Income, PartialPayment, Expense

class MedicalShopSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalShop
        fields = '__all__'

class ChequeDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChequeDetails
        fields = '__all__'

class PartialPaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartialPayment
        fields = '__all__'

class IncomeSerializer(serializers.ModelSerializer):
    medical_shop = MedicalShopSerializer(read_only=True)
    cheque = ChequeDetailsSerializer(read_only=True)

    medical_shop_id = serializers.PrimaryKeyRelatedField(queryset=MedicalShop.objects.all(), write_only=True, source='medical_shop')
    cheque_id = serializers.PrimaryKeyRelatedField(queryset=ChequeDetails.objects.all(), write_only=True, allow_null=True, required=False, source='cheque')

    class Meta:
        model = Income
        fields = '__all__'


class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = '__all__'