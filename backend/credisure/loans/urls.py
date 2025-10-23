from django.urls import path
from .views import LoanCreateListView, LoanAdminManageView,LoanAdminListView,LoanKycUploadView


urlpatterns = [
    path('', LoanCreateListView.as_view(), name='loan-list-create'),
    path('admin/all/',LoanAdminListView.as_view(), name = 'loan-admin-list'),
    path('admin/<int:pk>/',LoanAdminManageView.as_view(), name='loan-admin-manage'),
    path('kyc-upload/<int:loan_id>/',LoanKycUploadView.as_view(), name='loan-kyc-upload'),
]