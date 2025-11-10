from rest_framework import serializers
from .models import loanRequestForm, EmiSchedule



class EmiScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmiSchedule
        fields = '__all__'

class loanSerializer(serializers.ModelSerializer):
    borrower_username = serializers.CharField(source = 'borrower.username', read_only = True)
    class Meta:
        model = loanRequestForm
        fields = '__all__'
        read_only_fields = ['id','borrower','created_at', 'updated_at', 'kyc_status']
        