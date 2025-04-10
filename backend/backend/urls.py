"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from jobsearch import views
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/get-static-data/', views.get_static_data, name='get-static-data'),
    path('api/skill-search/', views.skill_search, name='skill-search'),
    path('api/job-search/', views.job_search, name='job-search'),
    path('api/get-user/', views.get_user, name='get-user'),
    path('api/create-account/', views.create_account, name='create-account'),
    path('api/update-account/', views.update_account, name='update-account'),
    path('api/get-density-data/', views.get_density_data, name='get-density-data'),
    path('api/get-dashbaord-data/', views.get_dashboard_data, name='get-dashboard-data'),

    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
]
