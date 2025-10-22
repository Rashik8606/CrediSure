from django.shortcuts import render
from .models import loanRequestForm
from .serializer import loanSerializer
from rest_framework import generics, permissions
from rest_framework.permissions import BasePermission
from .utils import send_email

# Create your views here.


# class IsBorrower(permissions.BasePermission):
#     def has_permission(self, request, view):
#         return request.user.is_authenticated and request.user.role == 'borrower'

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
    
    def perform_create(self, serializer):
        loan = serializer.save(borrower=self.request.user)
        print("Loan created:", loan)

        # get all admin emails
        from django.contrib.auth import get_user_model
        User = get_user_model()
        admins = User.objects.filter(role='admin')
        admin_emails = [admin.email for admin in admins ]

        # send email
        subject = self.admin_email_subject_template.format(borrower = self.request.user.username)
        message = self.admin_email_message_template.format(
            borrower = self.request.user.username,
            amount = loan.amount,
            purpose = loan.purpose
        )
        send_email(subject, message, admin_emails)


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


