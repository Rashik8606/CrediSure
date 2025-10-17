from django.shortcuts import render
from .models import loanRequestForm
from .serializer import loanSerializer
from rest_framework import generics, permissions

# Create your views here.


# Borrower can apply for loan and see their own loans
class LoanCreateListView(generics.ListCreateAPIView):
    serializer_class = loanSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):
        return loanRequestForm.objects.filter(borrower=self.request.user)
    

    def perform_create(self, serializer):
        serializer.save(borrower=self.request.user)



# Admin can see and update loan status
class LoanAdminManageView(generics.RetrieveUpdateAPIView):
    queryset = loanRequestForm.objects.all()
    serializer_class = loanSerializer
    permission_classes = [permissions.IsAdminUser]


class LoanAdminListView(generics.ListAPIView):
    queryset = loanRequestForm.objects.all()
    serializer_class = loanSerializer
    permission_classes = [permissions.IsAdminUser]
