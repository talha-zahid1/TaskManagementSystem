from django.contrib import admin
from .models import Team_model,Team_members,Task_model


# Register your models here.
admin.site.register(Team_members)
admin.site.register(Team_model)
admin.site.register(Task_model)
