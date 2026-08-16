from .views import authviews as av 
from .views import normviews as nv 
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView

from django.urls import path

urlpatterns=[
    path('register/',av.register_view.as_view()),
    path('api/token/',TokenObtainPairView.as_view()),
    path('api/token/refresh/',TokenRefreshView.as_view()),
    path('tasks/',nv.tasks_view.as_view()),
    path('tasks/<int:team_id>/',nv.tasks_view.as_view()),
    path('update-task/<int:task_id>/',nv.tasks_view.as_view()),
    path('create-team/',nv.create_team_view.as_view()),
    path('teams/<int:team_id>/',nv.team_detail_view.as_view()),
    path('add-team-mem/<int:team_id>/',nv.add_team_mem_view.as_view()),
    path('rem-team-mem/<int:team_id>/',nv.rem_team_mem_view.as_view()),
    path('get-team-mem/<int:team_id>/',nv.get_team_mem_view.as_view()),
    path('statistics/',nv.stats_view.as_view()),
    path('search-user/',nv.get_user_view.as_view()),  
    path('me/',nv.current_user_view.as_view()),
    path('statistics/<int:team_id>/',nv.stats_view.as_view()),
    path('get-teams/',nv.get_team_view.as_view()),
    path('get-single-team/<int:team_id>/',nv.get_single_team.as_view()),

]
