from django.shortcuts import render
import razorpay
from django.conf import settings
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

from .models import  EmiPayment
import requests


class CreateEmiPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        emi_id = request.data.get('emi_id')
        
        try:
            res = requests.get(f'http://127.0.0.1:8000/api/emi/{emi_id}/')
            emi_data = res.json()
        except:
            return Response(
                {'error':'EMI Service Error'},status=500
            )
        if emi_data.get('paid') :
            return Response(
                {'error':'Invalid or Already Paid EMI'},
                status=400
            )
        if emi_data.get('user_id') != request.user.id:
            return Response({'error':'Unauthrized '},status=403)
        
        amount = emi_data.get('emi_amount')

        if not amount :
            return Response({'error':'Invalid AMI Amount'},status=400)
        
        client = razorpay.Client(
            auth=(settings.RAZORPAY_KEY_ID , settings.RAZORPAY_KEY_SECRET)
        )
        

        order = client.order.create({
            'amount':int(amount*100),
            'currency':'INR',
            'payment_capture':1
        })

        EmiPayment.objects.create(
            loan_id = emi_data.get('loan_id'),
            emi_id = emi_id,
            user_id = request.user.id,
            order_id = order['id'],
            amount = amount
        )

        return Response({
            'order_id':order['id'],
            'amount':int(amount*100),
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

            if payment.user_id != request.user.id:
                return Response(
                    {
                        'error':'Unauthrized'
                    },
                    status=status.HTTP_403_FORBIDDEN
                )
            
            payment.payment_id = data['razorpay_payment_id']
            payment.status = 'success'
            payment.paid_at = timezone.now()
            payment.save()

            res = requests.post(f'http://127.0.0.1:8000/api/emi/{payment.emi_id}/pay/',
                         json={'payment_id':payment.payment_id})
            
            if res.status_code != 200:
                return Response({'error':'Failed to Update EMI '}, status=500)

            return Response({'message':'EMI Payment Successfully Completed'})
        
        except Exception:
            return Response (
                {'error':'Payment Verification Failed'},
                status=status.HTTP_400_BAD_REQUEST
            )


