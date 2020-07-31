from django.urls import path
from . import views

urlpatterns = [
    path('', views.choose_save, name='choose_save'),
    path('monitor/', views.monitor, name='monitor')
]