from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView 
from .serializer import MyTokensObtainPairSerializer 

# Create your views here.


# Login Or register
class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        if User.objects.filter(username=username).exists():
            return Response({'error':'Username is already exists !'})
        
        user = User.objects.create_user(username=username, password=password, email=email)
        return Response({'message':'User created successfully !'}, status=201)


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
    