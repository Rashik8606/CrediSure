from rest_framework import serializers
from .models import loanRequestForm


class loanSerializer(serializers.ModelSerializer):
    class Meta:
        model = loanRequestForm
        fields = '__all__'
        read_only_fields = ['borrower','status']
        