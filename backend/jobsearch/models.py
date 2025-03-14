from django.db import models

# Location data
class State(models.Model):
    state_name = models.CharField(max_length=30)
    state_code = models.CharField(max_length=2, unique=True)

    def __str__(self):
        return self.state_name

class County(models.Model):
    county_name = models.CharField(max_length=50)
    state = models.ForeignKey(State, on_delete=models.CASCADE)

    def __str__(self):
        return self.county_name

class City(models.Model):
    city_name = models.CharField(max_length=50)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    population = models.IntegerField(null=True)
    county = models.ForeignKey(County, on_delete=models.CASCADE)

    def __str__(self):
        return self.city_name

# Job and user data
class Skill(models.Model):
    skill_name = models.CharField(max_length=50)
    category = models.CharField(max_length=50)

    def __str__(self):
        return self.skill_name

class User(models.Model):
    user_name = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=50)
    state = models.ForeignKey(State, on_delete=models.CASCADE)
    education = models.CharField(max_length=20, blank=True)
    years_exp = models.IntegerField(null=True)
    skill_name = models.ManyToManyField(Skill, blank=True)

    def __str__(self):
        return self.user_name

class Job(models.Model):
    job_name = models.CharField(max_length=200)
    job_type = models.CharField(max_length=50, blank=True)
    job_desc = models.TextField()
    company = models.CharField(max_length=200)
    city = models.ForeignKey(City, null=True, on_delete=models.CASCADE)
    min_sal = models.FloatField(null=True)
    max_sal = models.FloatField(null=True)
    is_remote = models.BooleanField()
    post_date = models.DateField()
    years_exp = models.IntegerField(null=True)
    education = models.CharField(max_length=20)
    url = models.URLField(max_length=600)
    skills = models.ManyToManyField(Skill)

    def __str__(self):
        return self.job_name

class AltSkill(models.Model):
    skill = models.ForeignKey(Skill, related_name='alt_names', on_delete=models.CASCADE)
    alt_name = models.CharField(max_length=50)
