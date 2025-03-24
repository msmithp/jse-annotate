from django.contrib import admin
from .models import Skill, Profile, Job, AltSkill, City, County, State

# Register your models here.
class SkillAdmin(admin.ModelAdmin):
    list_display = ('id', 'skill_name', 'category')

class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user__username', 'user__password', 'state', 'education', 'years_exp')

class JobAdmin(admin.ModelAdmin):
    list_display = ('id', 'job_name', 'job_type', 'job_desc', 'company', 'city',
                    'min_sal', 'max_sal', 'url', 'is_remote', 'post_date', 'years_exp')

class AltSkillAdmin(admin.ModelAdmin):
    list_display = ('id', 'skill', 'alt_name')

class CityAdmin(admin.ModelAdmin):
    list_display = ('id', 'city_name', 'latitude', 'longitude', 'population', 'county')

class CountyAdmin(admin.ModelAdmin):
    list_display = ('id', 'county_name', 'state')

class StateAdmin(admin.ModelAdmin):
    list_display = ('id', 'state_name', 'state_code')


admin.site.register(Skill, SkillAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Job, JobAdmin)
admin.site.register(AltSkill, AltSkillAdmin)
admin.site.register(City, CityAdmin)
admin.site.register(County, CountyAdmin)
admin.site.register(State, StateAdmin)