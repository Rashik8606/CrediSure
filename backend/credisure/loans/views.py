from django.shortcuts import render
from .models import loanRequestForm,EmiSchedule
from .serializer import loanSerializer,EmiScheduleSerializer
from rest_framework import generics, permissions, status
from rest_framework.permissions import BasePermission,IsAuthenticated
from .utils import send_email
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.core.mail import EmailMultiAlternatives
from rest_framework import viewsets
from rest_framework.decorators import action
from django.utils import timezone
from rest_framework.parsers import MultiPartParser,FormParser
from rest_framework.exceptions import ValidationError



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
        existing_loan = loanRequestForm.objects.filter(
            borrower = request.user,
            status__in = ['pending','approved','under_process']
        ).exists()
        if existing_loan:
            raise ValidationError({'detail':'You have already a loan under process'})
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
    
class LoanActiveLoan(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        loan = loanRequestForm.objects.filter(
            borrower = request.user
        ).exclude(status = 'completed').order_by('-id').first()

        if not loan:
            return Response({'has_active_loan':False})

        if loan.status == 'approved':
            return Response({
                'has_active_loan':True,
                'approved_loan':True,
                'status':loan.status,
                'amount':loan.amount
            })
        return Response({
            'has_active_loan':True,
            'approved_loan':False,
            'status':loan.status,
            'amount':loan.amount
        })


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
        serializer.save()
 


# Loans list view Admin
class LoanAdminListView(generics.ListAPIView):
    queryset = loanRequestForm.objects.all()
    serializer_class = loanSerializer
    permission_classes = [isCustomAdmin]


class LoanKycUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, loan_id):
        try:
            loan = loanRequestForm.objects.get(id=loan_id, borrower = request.user)
        except loanRequestForm.DoesNotExist:
            return Response({'error':'Loan not found or not authorized'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = loanSerializer(loan, data = request.data, partial = True)
        if serializer.is_valid():
            serializer.save(kyc_status='UNDER_REVIEW')

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
            if loan.selfie:
                email.attach_file(loan.selfie.path)

            email.send(fail_silently = False)

            return Response({'message':'KYC Upload Successfully completed..',
                             'loan':loanSerializer(loan).data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class LoanViewSet(viewsets.ModelViewSet):
    queryset = loanRequestForm.objects.all()
    serializer_class = loanSerializer

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        loan = self.get_object()

        if loan.kyc_status != 'UNDER_REVIEW':
            return Response(
                {'error':'KYC must be submitted before approval'},status=400
            )
        loan.status = 'approved'
        loan.kyc_status = 'APPROVED'
        loan.save(update_fields=['status','kyc_status'])
        return Response({'status':'approved','kyc_status':'APPROVED'})

    @action(detail=True, method=['post'])
    def reject(self, request, pk=None):
        loan = self.get_object()
        loan.status = 'rejected'
        loan.kyc_status = 'REJECTED'
        loan.save(update_fields = ['status','kyc_status'])
        return Response({'status':'rejected','kyc_status':'REJECTED'})
    
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
        print('DEBUG LOAN ID',loan_id)
        qs = EmiSchedule.objects.filter(loan_id = loan_id).order_by('month_number')
        print('DEBUG COUNT',qs.count())
        return qs