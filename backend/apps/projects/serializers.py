from rest_framework import serializers
from .models import Project
from apps.accounts.serializers import UserMinimalSerializer
from apps.accounts.models import User


class ProjectSerializer(serializers.ModelSerializer):
    created_by = UserMinimalSerializer(read_only=True)
    members = UserMinimalSerializer(many=True, read_only=True)
    member_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=User.objects.all(),
        source='members', write_only=True, required=False
    )
    progress = serializers.ReadOnlyField()
    total_tasks = serializers.ReadOnlyField()
    completed_tasks = serializers.ReadOnlyField()
    overdue_tasks = serializers.ReadOnlyField()
    is_member = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'status', 'deadline',
            'created_by', 'members', 'member_ids',
            'progress', 'total_tasks', 'completed_tasks', 'overdue_tasks',
            'is_member', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']

    def get_is_member(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.members.filter(id=request.user.id).exists()
        return False

    def create(self, validated_data):
        members = validated_data.pop('members', [])
        project = Project.objects.create(
            created_by=self.context['request'].user,
            **validated_data
        )
        project.members.set(members)
        # Add creator as member too
        project.members.add(self.context['request'].user)
        return project

    def update(self, instance, validated_data):
        members = validated_data.pop('members', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if members is not None:
            instance.members.set(members)
        return instance


class ProjectListSerializer(serializers.ModelSerializer):
    created_by = UserMinimalSerializer(read_only=True)
    member_count = serializers.SerializerMethodField()
    progress = serializers.ReadOnlyField()
    total_tasks = serializers.ReadOnlyField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'status', 'deadline',
            'created_by', 'member_count', 'progress', 'total_tasks',
            'created_at', 'updated_at'
        ]

    def get_member_count(self, obj):
        return obj.members.count()
