from django.urls import path,include
from .views import( LoanCreateListView,
                    LoanAdminManageView,
                    LoanAdminListView,
                    LoanKycUploadView,
                    LoanViewSet,
                    LoanEmiListView)
from rest_framework.routers import DefaultRouter





urlpatterns = [
    path('', LoanCreateListView.as_view(), name='loan-list-create'),
    path('admin/all/',LoanAdminListView.as_view(), name = 'loan-admin-list'),
    path('admin/<int:pk>/',LoanAdminManageView.as_view(), name='loan-admin-manage'),
    path('kyc-upload/<int:loan_id>/',LoanKycUploadView.as_view(), name='loan-kyc-upload'),

    #EMI URL
    path('<int:pk>/approve/',LoanViewSet.as_view({'post':'approve'}), name='loan-approve'),
    path('<int:loan_id>/emi/', LoanViewSet.as_view({'get': 'emis'}), name='loan-emi'),
    path('<int:loan_id>/pay_emi/',LoanViewSet.as_view({'post':'pay_emi'}),name='loan-pay-emi'),
    path('<int:loan_id>/emi-schedule/',LoanEmiListView.as_view(),name='loan-emi-schedule'),
]