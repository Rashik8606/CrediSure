from django.urls import path
from .views import LoanCreateListView, LoanAdminManageView,LoanAdminListView


urlpatterns = [
    path('', LoanCreateListView.as_view(), name='loan-list-create'),
    path('admin/all/',LoanAdminListView.as_view(), name = 'loan-admin-list'),
    path('admin/<int:pk>/',LoanAdminManageView.as_view(), name='loan-admin-manage'),
]