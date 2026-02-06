from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView 
from .serializer import MyTokensObtainPairSerializer , UserRegisterSerializer, ChangePasswordSerializer
from rest_framework import status,generics,permissions
from rest_framework.permissions import AllowAny
# Create your views here.

User = get_user_model()
# Login Or register
class RegisterView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    def post(self, request):
        print("Incoming request data:", request.data)  # <--- DEBUG
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    'access':str(refresh.access_token),
                    'refresh':str(refresh),
                    'role':user.role
                 
                 },
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
    permission_classes = [permissions.AllowAny]
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
        print('Incoming data :',request.data)
        serializer = self.get_serializer(data=request.data, context = {'request':request})
        if not serializer.is_valid():
            print('Serializer error',serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = self.get_object()
        print('authenticated user: ',user.username  )
        print('Before :',user.password)
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        print('After :', user.password)

        return Response({'detail':'Password update successfully completed..'}, status=status.HTTP_200_OK)
    