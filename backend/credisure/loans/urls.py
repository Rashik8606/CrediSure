from django.urls import path
from .views import LoanCreateListView, LoanAdminManageView


urlpatterns = [
    path('', LoanCreateListView.as_view(), name='loan-list-create'),
    path('<int:pk>/',LoanAdminManageView.as_view(), name='loan-admin-manage'),
]