from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Task_model,Team_model,Team_members


class user_serializer(serializers.Serializer):
    username=serializers.CharField()
    email=serializers.EmailField()
    password=serializers.CharField(write_only=True)
class taskserializer(serializers.ModelSerializer):
    class Meta:
        model=Task_model
        fields=['id', 'title', 'description','team_id','assigned_to', 'created_at','status','priority','Due_date','update_at']
        read_only_fields = ['created_by']
class team_serializer(serializers.ModelSerializer):
    class Meta:
        model=Team_model
        fields= ['id', 'team_name', 'team_description', 'created_at', 'created_by', 'created_by_username']
        read_only_fields = ['created_by']
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
class member_serializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(source='user', queryset=User.objects.all())
    class Meta:
        model=Team_members
        fields=['id', 'role', 'joined_at', 'team_id', 'user_id']



