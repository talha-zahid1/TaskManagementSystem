from django.db import models
from django.contrib.auth.models import User



# Create your models here.

class Team_model(models.Model):
    id=models.AutoField(primary_key=True)
    team_name=models.CharField(max_length=100)
    team_description=models.TextField()
    created_at=models.DateTimeField(auto_now_add=True)
    created_by=models.ForeignKey(User,on_delete=models.CASCADE)

class Team_members(models.Model):
    team_id=models.ForeignKey(Team_model,on_delete=models.CASCADE)
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    role=models.CharField(max_length=50)
    joined_at=models.DateTimeField(auto_now_add=True)

class Task_model(models.Model):
    id=models.AutoField(primary_key=True)
    title=models.TextField()
    description=models.TextField()
    team_id=models.ForeignKey(Team_model,on_delete=models.CASCADE)
    assigned_to=models.ForeignKey(User,on_delete=models.CASCADE,related_name='assigned_tasks')
    created_at=models.DateTimeField(auto_now_add=True)
    status=models.CharField(max_length=50)
    priority=models.CharField(max_length=50)
    created_by=models.ForeignKey(User,on_delete=models.CASCADE,related_name='created_tasks')
    Due_date=models.DateTimeField()
    update_at=models.DateTimeField(blank=True,null=True)