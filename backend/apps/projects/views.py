from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q
from .models import Project
from .serializers import ProjectSerializer, ProjectListSerializer
from .permissions import IsAdminOrReadOnly, IsProjectMemberOrAdmin


class ProjectViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'deadline', 'title']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy', 'add_member', 'remove_member']:
            return [IsAdminOrReadOnly()]
        return [IsProjectMemberOrAdmin()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Project.objects.all().prefetch_related('members', 'tasks')
        return Project.objects.filter(
            Q(members=user) | Q(created_by=user)
        ).distinct().prefetch_related('members', 'tasks')

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        return ProjectSerializer

    @action(detail=True, methods=['post'])
    def add_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        try:
            from apps.accounts.models import User
            user = User.objects.get(pk=user_id)
            project.members.add(user)
            return Response({'message': f'{user.full_name} added to project.'})
        except Exception:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def remove_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        try:
            from apps.accounts.models import User
            user = User.objects.get(pk=user_id)
            project.members.remove(user)
            return Response({'message': f'{user.full_name} removed from project.'})
        except Exception:
            return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        qs = self.get_queryset()
        from django.utils import timezone
        return Response({
            'total': qs.count(),
            'active': qs.filter(status='active').count(),
            'completed': qs.filter(status='completed').count(),
            'planning': qs.filter(status='planning').count(),
            'on_hold': qs.filter(status='on_hold').count(),
        })
