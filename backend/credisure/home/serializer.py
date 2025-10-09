from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.conf import settings
from .models import User


class MyTokensObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
    
        token['username'] = user.username
        token['role'] = user.role
        return token
    
    def validate(self, attrs):
        data = super().validate(attrs)

        data['username'] = self.user.username
        data['role'] = self.user.role

        return data




class UserRegisterSerializer(serializers.ModelSerializer):
    admin_code = serializers.CharField(write_only = True, required = False, allow_blank = True)
    role = serializers.CharField(write_only = True, required = False, allow_blank = True)


    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'admin_code', 'role']
        extra_kwargs = {'password':{'write_only':True}}

    def create(self, validated_data):
        admin_code = validated_data.pop('admin_code', None)

        # Determine role
        if admin_code and admin_code == getattr(settings, 'ADMIN_SECRET_KEY', None):
            role = 'admin'
        else:
            role = 'borrower'

        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            role=role
        )
        return user
    