from django.contrib import admin
from .models import Skill, User, Job, AltSkill, Has, Requires

# Register your models here.
class SkillAdmin(admin.ModelAdmin):
    list_display = ('id', 'skill_name', 'category')

class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_name', 'password', 'city', 'state', 'education', 'years_exp')

class JobAdmin(admin.ModelAdmin):
    list_display = ('id', 'site', 'job_name', 'job_type', 'job_desc', 'company', 'city', 'state', 'min_sal', 'is_remote', 'post_date', 'years_exp')

class AltSkillAdmin(admin.ModelAdmin):
    list_display = ('id', 'skill_name', 'alt_name')
    
class HasAdmin(admin.ModelAdmin):
    list_display = ('user_name', 'skill_name')

class RequiresAdmin(admin.ModelAdmin):
    list_display = ('job_name', 'skill_name')

admin.site.register(Skill, SkillAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(Job, JobAdmin)
admin.site.register(AltSkill, AltSkillAdmin)
admin.site.register(Has, HasAdmin)
admin.site.register(Requires, RequiresAdmin)