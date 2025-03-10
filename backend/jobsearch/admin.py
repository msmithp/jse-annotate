from django.contrib import admin
from .models import Skill, User, Job, AltSkill

# Register your models here.
class SkillAdmin(admin.ModelAdmin):
    list_display = ('id', 'skill_name', 'category')

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_name', 'password', 'city', 'state', 'education', 'years_exp', 'skill_name')

class JobAdmin(admin.ModelAdmin):
    list_display = ('id', 'site', 'job_name', 'job_type', 'job_desc', 'company', 'city', 'state', 'min_sal', 'is_remote', 'post_date', 'years_exp', 'skill_name')

class AltSkillAdmin(admin.ModelAdmin):
    list_display = ('id', 'skill_name', 'alt_name')

admin.site.register(Skill, SkillAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Job, JobAdmin)
admin.site.register(AltSkill, AltSkillAdmin)