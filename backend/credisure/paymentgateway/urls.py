from django.urls import path
from .views import CreateEmiPaymentView, VerifyEmiPaymentsView



urlpatterns = [
<<<<<<< HEAD
    path('emi/create-payment',CreateEmiPaymentView.as_view()),
    path('emi/verify-payment',VerifyEmiPaymentsView.as_view()),
=======
    path('emi/create-payment/',CreateEmiPaymentView.as_view()),
    path('emi/verify-payment/',VerifyEmiPaymentsView.as_view()),
>>>>>>> 76d95f9cabd8085d273e46c1440699b989dd12bb

]