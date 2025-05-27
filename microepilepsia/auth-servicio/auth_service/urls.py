from django.urls import path

from auth_app.views import key_auth_view, validate_view

urlpatterns = [
    path('key-auth/', key_auth_view),
    path('validate/', validate_view),
]
