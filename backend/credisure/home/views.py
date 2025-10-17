from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView 
from .serializer import MyTokensObtainPairSerializer , UserRegisterSerializer, ChangePasswordSerializer
from rest_framework import status,generics,permissions
# Create your views here.

User = get_user_model()
# Login Or register
class RegisterView(APIView):
    def post(self, request):
        print("Incoming request data:", request.data)  # <--- DEBUG
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {'Message': f'User {user.username} created successfully as {user.role}!'},
                status=status.HTTP_201_CREATED
            )
        print("Serializer errors:", serializer.errors)  # <--- DEBUG
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
    

class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context = {'request':request})
        serializer.is_valid(raise_exception = True)

        user = self.get_object()
        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({'detail':'Password update successfully completed..'}, status=status.HTTP_200_OK)
    