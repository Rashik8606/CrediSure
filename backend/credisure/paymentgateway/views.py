from django.shortcuts import render
import razorpay
from django.conf import settings
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

from .models import EmiSchedule, EmiPayment



class CreateEmiPaymentView(APIView):
    permission_classes = [IsAuthenticated]
        

    def post(self, request):
        print("🔥 EMI PAYMENT HIT")
        print(request.data)
        emi_id = request.data.get('emi_id')
        
        try:
            emi = EmiSchedule.objects.get(id=emi_id, paid = False)
        except EmiSchedule.DoesNotExist:
            return Response(
                {'error':'Invalid or Already Paid EMI'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if emi.loan.borrower != request.user:
            return Response(
                {'error':'Unauthrized User'},
                status=status.HTTP_403_FORBIDDEN
            )
        if EmiPayment.objects.filter(emi=emi, status='success').exists():
            return Response(
                {'error':'EMI Already Paid'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID , settings.RAZORPAY_KEY_SECRET)
        )
        amount_paise = int(emi.emi_amount * 100)

        order = client.order.create({
            'amount':amount_paise,
            'currency':'INR',
            'payment_capture':1
        })

        EmiPayment.objects.create(
            loan = emi.loan,
            emi = emi,
            order_id = order['id'],
            amount = emi.emi_amount
        )

        return Response({
            'order_id':order['id'],
            'amount':amount_paise,
            'key':settings.RAZORPAY_KEY_ID
        })



class VerifyEmiPaymentsView(APIView):
    permission_classes = [IsAuthenticated]

    def  post(self, request):
        data = request.data

        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET)
        )

        try:
            client.utility.verify_payment_signature({
                'razorpay_order_id':data['razorpay_order_id'],
                'razorpay_payment_id':data['razorpay_payment_id'],
                'razorpay_signature':data['razorpay_signature']
            })

            payment = EmiPayment.objects.get(order_id = data['razorpay_order_id'])

            if payment.loan.borrower != request.user:
                return Response(
                    {
                        'error':'Unauthrized'
                    },
                    status=status.HTTP_403_FORBIDDEN
                )
            
            payment.payment_id = data['payment_id']
            payment.status = 'success'
            payment.paid_at = timezone.now()
            payment.save()


            emi = payment.emi
            emi.paid = True
            emi.paid_at = timezone.now()
            emi.save()

            return Response({'message':'EMI Payment Successfully Completed'})
        
        except Exception:
            return Response (
                {'error':'Payment Verification Failed'},
                status=status.HTTP_400_BAD_REQUEST
            )


