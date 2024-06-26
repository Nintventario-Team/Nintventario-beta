from django.contrib import admin
from django_use_email_as_username.admin import BaseUserAdmin # type: ignore

from .models import User

admin.site.register(User, BaseUserAdmin)
