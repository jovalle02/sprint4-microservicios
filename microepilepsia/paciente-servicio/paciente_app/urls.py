from django.urls import path
from .views import ListaPacientes

urlpatterns = [
    path('pacientes/', ListaPacientes.as_view()),
]
