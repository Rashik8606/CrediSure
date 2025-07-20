from django.urls import path
from .views import HomePage,RegisterView,LogoutView,MyTokenObtainPairView


urlpatterns = [
    path('api/token/',MyTokenObtainPairView.as_view(),name='token_obtain_pair'),
    path('api/home/',HomePage.as_view(),name='home'),
    path('api/register/',RegisterView.as_view(),name='register'),
    path('api/logout/',LogoutView.as_view(),name='logout'),
   
]