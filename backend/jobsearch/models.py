from django.db import models

# Create your models here.
class Skill(models.Model):
    skill_name = models.CharField(max_length=20)
    category = models.CharField(max_length=20)

class User(models.Model):
    user_name = models.CharField(max_length=20)
    password = models.CharField(max_length=20)
    city = models.CharField(max_length=20, blank=True)
    state = models.CharField(max_length=2, blank=True)
    education = models.CharField(max_length=20, blank=True)
    years_exp = models.IntegerField(null=True)
    skill_name = models.ForeignKey(Skill, on_delete=models.CASCADE)

class Job(models.Model):
    site = models.CharField(max_length=10)
    job_name = models.CharField(max_length=50)
    job_type = models.CharField(max_length=10, blank=True)
    job_desc = models.CharField(max_length=200)
    company = models.CharField(max_length=50)
    city = models.CharField(max_length=20)
    state = models.CharField(max_length=2)
    min_sal = models.FloatField(null=True)
    is_remote = models.BooleanField()
    post_date = models.DateField()
    years_exp = models.IntegerField(null=True)
    skill_name = models.ForeignKey(Skill, on_delete=models.CASCADE)


class AltSkill(models.Model):
    skill_name = models.ForeignKey(Skill, related_name='alt_names', on_delete=models.CASCADE)
    alt_name = models.CharField(max_length=20)