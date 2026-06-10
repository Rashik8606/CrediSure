from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import User

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id = validated_token.get('user_id')
        username = validated_token.get('username') or f'user_{user_id}'
        role = validated_token.get('role', 'borrower')

        # Create or update the standard auth.User in the credisure DB
        user, created = User.objects.get_or_create(
            id=user_id,
            defaults={'username': username}
        )
        
        # If user exists but username changed, update it
        if not created and user.username != username:
            user.username = username
            user.save()
            
        # Dynamically assign the role to the user instance
        # This will be available as request.user.role in views
        user.role = role

        return user
