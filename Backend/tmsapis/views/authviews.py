from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from ..serializer import user_serializer

class  register_view(APIView):
    permission_classes=[AllowAny]

    def get_tokens(self,user):
        refresh=RefreshToken.for_user(user)
        return {
            'access':str(refresh.access_token),
            'refresh':str(refresh)
        }



    def post(self,req):


        serializer=user_serializer(data=req.data)
        if serializer.is_valid():
            data=serializer.validated_data
            if User.objects.filter(username=data['username']).exists():
                return Response({
                    'status':False,
                    'message':'Username Already Taken'
                },status=400)
            user=User.objects.create_user(username=data['username'],email=data['email'],password=data['password'])
            tokens=self.get_tokens(user=user)
            
            return Response({
                'status':True,
                'message':'Registered Successfuly',
                'username':data['username'],
                'email':data['email'],
                'user_id':user.id,
                'tokens':tokens,
            })
        return Response(serializer.errors,status=400)
