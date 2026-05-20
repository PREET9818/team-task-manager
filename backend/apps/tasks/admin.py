from django.contrib import admin
from .models import Task


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'assigned_to', 'priority', 'status', 'due_date', 'is_overdue']
    list_filter = ['status', 'priority', 'project']
    search_fields = ['title', 'description']
    readonly_fields = ['created_at', 'updated_at']
