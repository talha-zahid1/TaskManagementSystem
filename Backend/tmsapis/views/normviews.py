from rest_framework.views import APIView
from django.db.models import Q, Count
from ..models import Task_model,Team_model,Team_members
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.contrib.auth.models import User
from django.db.models import OuterRef,Subquery
from ..serializer import taskserializer,team_serializer,member_serializer


def is_team_admin(team,user):
    return team.created_by == user or Team_members.objects.filter(
        team_id=team,
        user=user,
        role__iexact='admin'
    ).exists()


class tasks_view(APIView):
    permission_classes=[IsAuthenticated]


    def get(self,req,task_id=None):
        if task_id:
            task=Task_model.objects.filter(id=task_id).first()
            if not task:
                return Response({
                'status':False,
                'message':'task Not Found'
                },status=404)
        else:
            task=Task_model.objects.all()    
        
        
        return Response({
            'status':True,
            'message':'TaskList' if not task_id else f'Task {task_id}',
            'task':taskserializer(task,many=True).data if not task_id else taskserializer(task).data
        })
        
        
    def post(self,req):
        serializer=taskserializer(data=req.data)
        cb=Team_model.objects.filter(id=req.data.get('team_id')).first()
        if not cb:
            return Response({
                'status':False,
                'message':'Team not found '
            },status=404)
        if not is_team_admin(cb,req.user):
            return Response({
                'status':False,
                'message':'Only Admin can add tasks'
            },status=403)
        mem=Team_members.objects.filter(team_id=cb.id, user_id=req.data.get('assigned_to')).first()
        if not mem:
            return Response({
                'status':False,
                'message':"user doesn't exist in group"
            },status=400)
        
        if serializer.is_valid():
            task=serializer.save(created_by=req.user)
            return Response({
                'status':True,
                'message':'Task Added',
                'task_id':task.id
            })
        return Response(serializer.errors,status=400)
    
    def put(self,req,task_id):
        task=Task_model.objects.filter(id=task_id).first()
        if not task:
            return Response({
                'status':False,
                'message':'task Not Found'
            },status=404)
        if not is_team_admin(task.team_id,req.user):
            return Response({
                'status':False,
                'message':'Only Admin can update tasks'
            },status=403)
        serializer=taskserializer(task,data=req.data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status':True,
                'message':f'task {task_id} updated'
            })
        return Response(serializer.errors,status=400)
        
    def delete(self,req,task_id):
        task=Task_model.objects.filter(id=task_id).first()
        if not task:
            return Response({
                'status':False,
                'message':'task Not Found'
            },status=404)
        if not is_team_admin(task.team_id,req.user):
            return Response({
                'status':False,
                'message':'Only Admin can update tasks'
            },status=403)
        task.delete()
        return Response({
                'status':True,
                'message':f'task {task_id} deleted'
            })

class create_team_view(APIView):
    permission_classes=[IsAuthenticated]  

    def post(self,req):
        serializer=team_serializer(data=req.data)
        if serializer.is_valid():
            
            team=serializer.save(created_by=req.user)
            member=Team_members.objects.create(team_id=team,user=req.user,role="admin")
            return Response({
                'status':True,
                'message':'Group Created',
                'team_id':team.id
            })
        return Response(serializer.errors,status=400)

class team_detail_view(APIView):
    permission_classes=[IsAuthenticated]

    def delete(self,req,team_id):
        team=Team_model.objects.filter(id=team_id).first()
        if not team:
            return Response({
                'status':False,
                'message':'Team Not Found'
            },status=404)
        if not is_team_admin(team,req.user):
            return Response({
                'status':False,
                'message':'Only Admin can delete team'
            },status=403)
        team.delete()
        return Response({
            'status':True,
            'message':f'Team {team_id} deleted'
        })

class add_team_mem_view(APIView):
    permission_classes=[IsAuthenticated]


    def post(self,req,team_id):
        team=Team_model.objects.filter(id=team_id).first()
        if not team:
            return Response({
                'status':False,
                'message':'Team Not Found'
            },status=404)
        if not is_team_admin(team,req.user):
            return Response({
                'status':False,
                'message':'Only Admin can add members'
            },status=403)
        serializer=member_serializer(data=req.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                    'status':True,
                    'message':'User Added'
                })
        return Response(serializer.errors,status=400)
        
class rem_team_mem_view(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,req,team_id):
        team=Team_model.objects.filter(id=team_id).first()
        if not team:
            return Response({
                'status':False,
                'message':'Team Not Found'
            },status=404)
        if not is_team_admin(team,req.user):
            return Response({
                'status':False,
                'message':'Only Admin can rem members'
            },status=403)
        user_id=req.data.get('user_id')
        try:
            user=User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({
                'status':False,
                'message':f'{user.username} is Not Registered'
            },status=400)
        mem=Team_members.objects.filter(user_id=user_id,team_id=team).first()
        if not mem:
            return Response({
                'status':False,
                'message':f'{user.username} not found in team'
            },status=404)
        mem.delete()
        return Response({
            'status':True,
            'message':f'{user.username} Deleted'
        })
            
        
class get_team_mem_view(APIView):
    permission_classes=[IsAuthenticated]


    def get(self,req,team_id):
        team=Team_model.objects.filter(id=team_id).first()
        if not team:
            return Response({
                'status':False,
                'message':'Team Not Found'
            },status=404)
        mem=Team_members.objects.filter(team_id=team)
        if not mem:
            return Response({
            'status':False,
            'message':f"Team {team_id} emtpy"
        },status=404)
        
        data=[
            {
            'team_id':m.team_id.id,
            'user_id':m.user.id,
            'username':m.user.username,
            'role':m.role,
            'team_name':m.team_id.team_name,
            'joined_at':m.joined_at
            }
        for m in mem
        ]
        return Response({
            'status':True,
            'message':'Team Members',
            'members':data
        })

class stats_view(APIView):
    permission_classes=[IsAuthenticated]


    def get(self,req,team_id=None):
        if team_id:
            team=Team_model.objects.filter(id=team_id).first()
            if not team:
                return Response({
                    'status':False,
                    'message':'Team Not Found'
                },status=404)
            task=Task_model.objects.filter(team_id=team).aggregate(
            total_tasks=Count('id'),
            In_progress=Count('id',filter=Q(status='Progress')),
            Completed=Count('id',filter=Q(status='Completed')),
            review_tasks=Count('id',filter=Q(status='Review')),
            todo_tasks=Count('id',filter=Q(status='todo')),
            high_priority_tasks=Count('id',filter=Q(priority='High')),
            over_due_tasks=Count('id',filter=Q(Due_date__lte=timezone.now()))
            )
        else:
            task=Task_model.objects.aggregate(
            total_tasks=Count('id'),
            In_progress=Count('id',filter=Q(status='Progress')),
            Completed=Count('id',filter=Q(status='Completed')),
            review_tasks=Count('id',filter=Q(status='Review')),
            todo_tasks=Count('id',filter=Q(status='todo')),
            high_priority_tasks=Count('id',filter=Q(priority='High')),
            over_due_tasks=Count('id',filter=Q(Due_date__lte=timezone.now()))
        )
        return Response(task)        
        
class get_user_view(APIView):
    def get(self,req):
        username=req.GET.get('q','')
        if not username:
            return Response({
                'status':False,
                'message':'username missing'
            },status=400)
        user=User.objects.filter(username=username).first()
        if not user:
            return Response({
                'status':False,
                'message':'User Not Found'
            },status=404)
        return Response({
            'status':True,
            'message':'user data',
            'user_id':user.id,
            'username':user.username,
            'email':user.email

        })

class current_user_view(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,req):
        return Response({
            'status':True,
            'user_id':req.user.id,
            'username':req.user.username,
            'email':req.user.email
        })

class get_team_view(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,req):
        teams=Team_model.objects.filter(Q(team_members__user=req.user )|Q(created_by=req.user)).distinct()
        serializer=team_serializer(teams,many=True)
        
        return Response({
            'status':True,
            'message':'Data',
            'data':serializer.data
        })
