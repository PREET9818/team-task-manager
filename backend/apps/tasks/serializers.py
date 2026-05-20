from rest_framework import serializers
from django.utils import timezone
from .models import Task
from apps.accounts.serializers import UserMinimalSerializer
from apps.accounts.models import User
from apps.projects.models import Project


class TaskSerializer(serializers.ModelSerializer):
    assigned_to = UserMinimalSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source='assigned_to',
        write_only=True,
        required=False,
        allow_null=True
    )
    created_by = UserMinimalSerializer(read_only=True)
    project_id = serializers.PrimaryKeyRelatedField(
        queryset=Project.objects.all(),
        source='project',
        write_only=True
    )
    project_title = serializers.CharField(source='project.title', read_only=True)
    is_overdue = serializers.ReadOnlyField()

    class Meta:
        model = Task
        fields = [
            'id', 'title', 'description',
            'project_id', 'project_title',
            'assigned_to', 'assigned_to_id',
            'created_by', 'priority', 'status',
            'due_date', 'is_overdue',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class TaskStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ['status']

    def validate_status(self, value):
        allowed = [s[0] for s in Task.STATUS_CHOICES]
        if value not in allowed:
            raise serializers.ValidationError(f'Status must be one of: {", ".join(allowed)}')
        return value


class DashboardSerializer(serializers.Serializer):
    total_projects = serializers.IntegerField()
    total_tasks = serializers.IntegerField()
    completed_tasks = serializers.IntegerField()
    pending_tasks = serializers.IntegerField()
    in_progress_tasks = serializers.IntegerField()
    overdue_tasks = serializers.IntegerField()
    completion_rate = serializers.FloatField()
