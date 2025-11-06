from django.shortcuts import render
from .models import loanRequestForm,EmiSchedule
from .serializer import loanSerializer,EmiScheduleSerializer
from rest_framework import generics, permissions, status
from rest_framework.permissions import BasePermission
from .utils import send_email
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from rest_framework import viewsets
from rest_framework.decorators import action
from django.utils import timezone



# Create your views here.


# Borrower can apply for loan and see their own loans
class LoanCreateListView(generics.ListCreateAPIView):
    serializer_class = loanSerializer
    permission_classes = [permissions.IsAuthenticated]


    '''IF YOU NEED TO BORROWER FORM .UNCOMMENT THIS SECTION'''
    # email templates 
    # admin_email_subject_template = "New Loan Request from {borrower}"
    # admin_email_message_template = """
    # Borrower : {borrower}
    # Amount : {amount}
    # Purpose : {purpose}
    
    # Please review this loan request in the admin dashboard
    #     """

    def get_queryset(self):
        return loanRequestForm.objects.filter(borrower=self.request.user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        loan = serializer.save(borrower=self.request.user)


        ''' SENDING EMAIL LOGIC '''
        # Email sending logic here...
        # from django.contrib.auth import get_user_model
        # User = get_user_model()
        # admins = User.objects.filter(role='admin')
        # admin_emails = [admin.email for admin in admins ]

        # subject = f"New Loan Request from {request.user.username}"
        # message = f"""
        # <html>
        # <body style="font-family:Arial,sans-serif; background-color:#f9f9f9; padding:20px;">
        #     <div style="background-color:#ffffff; border-radius:8px; padding:20px; max-width:600px; margin:auto; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        #         <h2 style="color:#007bff;">New Loan Request</h2>
        #         <p><b>Borrower:</b> {request.user.username}</p>
        #         <p><b>Amount:</b> ₹{loan.amount}</p>
        #         <p><b>Purpose:</b> {loan.purpose}</p>
        #         <p>Please review this request in the admin dashboard.</p>
        #     </div>
        # </body>
        # </html>
        # """
        # send_email(subject, message, admin_emails, html=True)

        return Response({'id': loan.id}, status=status.HTTP_201_CREATED)


# This custom Admin auth
class isCustomAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'


# Admin can see and update loan status
class LoanAdminManageView(generics.RetrieveUpdateAPIView):
    queryset = loanRequestForm.objects.all()
    serializer_class = loanSerializer
    permission_classes = [isCustomAdmin]



    def perform_update(self, serializer):
        loan = serializer.save() #update the loan
        print("Loan updated:", loan)

        subject = f"Your Loan Request has been {loan.status.capitalize()}"
        message = f"""
        <html>
        <body style="font-family:Arial,sans-serif; background-color:#f9f9f9; padding:20px;">
            <div style="background-color:#ffffff; border-radius:8px; padding:20px; max-width:600px; margin:auto; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                <h2 style="color:#007bff;">Loan Update - Credisure</h2>
                <p>Hi <b>{loan.borrower.username}</b>,</p>
                <p>Your loan request of <b>₹{loan.amount}</b> has been <b>{loan.status.upper()}</b>.</p>
                <p>Thank you for choosing <b>Credisure</b> — we appreciate your trust in us.</p>
                <br>
                <p style="font-size:14px; color:#555;">Best regards,<br><b>Rashik</b><br>CEO, Credisure</p>
            </div>
        </body>
        </html>
        """
        send_email(subject, message, [loan.borrower.email],html=True)


# Loans list view Admin
class LoanAdminListView(generics.ListAPIView):
    queryset = loanRequestForm.objects.all()
    serializer_class = loanSerializer
    permission_classes = [isCustomAdmin]


class LoanKycUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, loan_id):
        try:
            loan = loanRequestForm.objects.get(id=loan_id, borrower = request.user)
        except loanRequestForm.DoesNotExist:
            return Response({'error':'Loan not found or not authorized'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = loanSerializer(loan, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save()

            User = get_user_model()
            admins = User.objects.filter(role = 'admin')
            admin_emails = [admin.email for admin in admins]
    
            subject = f"KYC Completed by {request.user.username}"
            message = f"""
            <html>
            <body style="font-family:Arial,sans-serif; background-color:#f9f9f9; padding:20px;">
             <div style="background-color:#ffffff; border-radius:8px; padding:20px; max-width:600px; margin:auto; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                 <h2 style="color:#007bff;">New Loan Request</h2>
                 <p><b>Borrower:</b> {request.user.username}</p>
                 <p><b>Amount:</b> ₹{loan.amount}</p>
                 <p><b>Purpose:</b> {loan.purpose}</p>
                 <p>Please review this request in the admin dashboard.</p>
             </div>
                <div style="background-color:#ffffff; border-radius:8px; padding:20px; max-width:600px; margin:auto; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
                    <h2 style="color:#28a745;">KYC Submitted</h2>
                    <p>Borrower <b>{request.user.username}</b> has completed their KYC verification.</p>
                    <p>Please review the attached documents in the admin panel.</p>
                </div>
            </body>
            </html>
            """

            email = EmailMultiAlternatives(subject, '', to=admin_emails)
            email.attach_alternative(message, 'text/html')
            
            if loan.aadhaar_front:
                email.attach_file(loan.aadhaar_front.path)
            if loan.aadhaar_back:
                email.attach_file(loan.aadhaar_back.path)
            if loan.pan_card:
                email.attach_file(loan.pan_card.path)

            email.send(fail_silently = False)

            return Response({'message':'KYC Upload Successfully completed..'}, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class LoanViewSet(viewsets.ModelViewSet):
    queryset = loanRequestForm.objects.all()
    serializer_class = loanSerializer

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        loan = self.get_object()
        loan.status = 'approved'
        loan.save()
        return Response({'status':'approved'})
    
    @action(detail=True, methods=['get'])
    def emis(self, request, pk=None):
        loan = self.get_object()
        emi_id = request.data.get('emi_id')
        emi = get_object_or_404(EmiSchedule, id=emi_id, loan=loan)
        emi.paid = True
        emi.paid_at = timezone.now()
        emi.save()


        if not loan.emis.filter(paid=False).exists():
            loan.status = 'completed'
            loan.save()
        return Response({'paid': True})


class LoanEmiListView(generics.ListAPIView):
    serializer_class = EmiScheduleSerializer

    def get_queryset(self):
        loan_id = self.kwargs['loan_id']
        return EmiSchedule.objects.filter(loan_id = loan_id).order_by('month_number')