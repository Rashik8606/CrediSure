# from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
# from rest_framework import serializers
# from django.conf import settings
# from .models import User
# from django.contrib.auth.password_validation import validate_password


# class MyTokensObtainPairSerializer(TokenObtainPairSerializer):
#     @classmethod
#     def get_token(cls, user):
#         token = super().get_token(user)
    
#         token['username'] = user.username
#         token['role'] = user.role
#         return token
    
#     def validate(self, attrs):
#         data = super().validate(attrs)


#         user = self.user
#         request = self.context.get('request')

#         secret_key = request.data.get('secret_key','').strip()
#         admin_secret = settings.ADMIN_SECRET_KEY

#         if user.role == 'admin':
#             if not secret_key or secret_key != admin_secret:
#                 raise serializers.ValidationError({
#                     'error':'invalid secret key !'
#                 })

#         data['username'] = self.user.username
#         data['role'] = self.user.role

#         return data




# class UserRegisterSerializer(serializers.ModelSerializer):
#     secret_key  = serializers.CharField(write_only = True, required = False, allow_blank = True)
#     role = serializers.CharField(write_only = True, required = False, allow_blank = True)


#     class Meta:
#         model = User
#         fields = ['username', 'email', 'password', 'secret_key', 'role']
#         extra_kwargs = {'password':{'write_only':True}}

#     def create(self, validated_data):
#         secret_key  = validated_data.pop('secret_key', None)

#         # Determine role
#         if secret_key :
#             if secret_key != settings.ADMIN_SECRET_KEY:
#                 raise serializers.ValidationError({
#                     'secret_key':'Invalid admin secret key'
#                 })
#             role = 'admin'
#         else:
#             role = 'borrower'

#         user = User.objects.create_user(
#             username=validated_data['username'],
#             password=validated_data['password'],
#             email=validated_data['email'],
#             role=role
#         )
#         return user
    

# class ChangePasswordSerializer(serializers.Serializer):
#     old_password = serializers.CharField(required = True, write_only = True)
#     new_password = serializers.CharField(required = True, write_only = True, validators = [validate_password])


#     def validate_old_password(self, value):
#         user = self.context['request'].user
#         if not user.check_password(value):
#             raise serializers.ValidationError('Old Password is Incorrect..')
#         return value