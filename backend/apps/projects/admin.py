from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'status', 'created_by', 'deadline', 'created_at']
    list_filter = ['status', 'created_at']
    search_fields = ['title', 'description']
    filter_horizontal = ['members']
    readonly_fields = ['created_at', 'updated_at']
