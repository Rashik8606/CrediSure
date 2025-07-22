from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView 
from .serializer import MyTokensObtainPairSerializer 
from rest_framework import status
# Create your views here.

User = get_user_model()
# Login Or register
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        role = request.data.get('role','borrower')

        if User.objects.filter(username=username).exists():
            return Response({'error':'Username is already exists !'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, password=password, email=email,role=role)
        if role == 'admin':
            user.is_staff = True
            user.save()

        return Response({'message':'User created successfully !'}, status=status.HTTP_201_CREATED)


# Logout 
class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({'message':'Logout successfully !'},status=status.HTTP_400_BAD_REQUEST)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokensObtainPairSerializer


class HomePage(APIView):
    def get(self, request):
        return Response({'message':'hello we are credisure !'})
    