from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



class MyTokensObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
    
        token['username'] = user.username
        token['is_staff'] = user.is_staff
        token['role'] = user.role

        return token
