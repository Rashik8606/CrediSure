from django.shortcuts import render
from .models import loanRequestForm
from .serializer import loanSerializer
from rest_framework import generics, permissions, status
from rest_framework.permissions import BasePermission
from .utils import send_email
from rest_framework.views import APIView
from rest_framework.response import Response


# Create your views here.


# Borrower can apply for loan and see their own loans
class LoanCreateListView(generics.ListCreateAPIView):
    serializer_class = loanSerializer
    permission_classes = [permissions.IsAuthenticated]


    # email templates 
    admin_email_subject_template = "New Loan Request from {borrower}"
    admin_email_message_template = """
    Borrower : {borrower}
    Amount : {amount}
    Purpose : {purpose}
    
    Please review this loan request in the admin dashboard
        """

    def get_queryset(self):
        return loanRequestForm.objects.filter(borrower=self.request.user)
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        loan = serializer.save(borrower=self.request.user)

        # Email sending logic here...
        from django.contrib.auth import get_user_model
        User = get_user_model()
        admins = User.objects.filter(role='admin')
        admin_emails = [admin.email for admin in admins ]

        subject = f"New Loan Request from {request.user.username}"
        message = f"""
        Borrower: {request.user.username}
        Amount: {loan.amount}
        Purpose: {loan.purpose}

        Please review this loan request in the admin dashboard
        """
        send_email(subject, message, admin_emails)

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

    # email templates
    borrower_email_subject_template = "Your Loan Request has been {status}"
    borrower_email_message_template = """
    Hello {borrower}
    
    Your Loan request of Amount ${amount} has been {status}
    
    
    Thank You 
    
    """


    def perform_update(self, serializer):
        loan = serializer.save() #update the loan
        print("Loan updated:", loan)

        subject = self.borrower_email_subject_template.format(status = loan.status.capitalize())
        message = self.borrower_email_message_template.format(
            borrower = loan.borrower.username,
            amount = loan.amount,
            status = loan.status
        )
        send_email(subject, message, [loan.borrower.email])


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
            return Response({'message':'KYC Upload Successfully completed..'}, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    