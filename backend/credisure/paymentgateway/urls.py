from django.urls import path
from .views import CreateEmiPaymentView, VerifyEmiPaymentsView



urlpatterns = [
    path('emi/create-payment',CreateEmiPaymentView.as_view()),
    path('emi/verify-payment',VerifyEmiPaymentsView.as_view()),

]