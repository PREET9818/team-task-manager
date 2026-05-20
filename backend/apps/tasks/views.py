from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from django.utils import timezone
from .models import Task
from .serializers import TaskSerializer, TaskStatusSerializer, DashboardSerializer
from .permissions import IsTaskOwnerOrAdmin, CanCreateTask
from apps.projects.models import Project


class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'priority', 'project', 'assigned_to']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'due_date', 'priority', 'status']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsTaskOwnerOrAdmin()]
        if self.action == 'update_status':
            return [IsAuthenticated()]
        return [IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            qs = Task.objects.all()
        else:
            qs = Task.objects.filter(
                Q(assigned_to=user) | Q(created_by=user)
            ).distinct()

        # Filter by overdue
        overdue = self.request.query_params.get('overdue')
        if overdue == 'true':
            qs = qs.filter(
                due_date__lt=timezone.now().date(),
                status__in=['pending', 'in_progress']
            )
        return qs.select_related('project', 'assigned_to', 'created_by')

    def create(self, request, *args, **kwargs):
        if request.user.role != 'admin':
            return Response(
                {'error': 'Only admins can create tasks.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        task = self.get_object()
        if request.user.role != 'admin' and task.created_by != request.user:
            return Response(
                {'error': 'Only admins can edit tasks.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        if request.user.role != 'admin':
            return Response(
                {'error': 'Only admins can delete tasks.'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)

    @action(detail=True, methods=['patch'], url_path='status')
    def update_status(self, request, pk=None):
        task = self.get_object()
        user = request.user
        # Members can only update their assigned tasks
        if user.role != 'admin' and task.assigned_to != user:
            return Response(
                {'error': 'You can only update status of your own tasks.'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = TaskStatusSerializer(task, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(TaskSerializer(task, context={'request': request}).data)


class DashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == 'admin':
            projects_qs = Project.objects.all()
            tasks_qs = Task.objects.all()
        else:
            projects_qs = Project.objects.filter(
                Q(members=user) | Q(created_by=user)
            ).distinct()
            tasks_qs = Task.objects.filter(
                Q(assigned_to=user) | Q(created_by=user)
            ).distinct()

        today = timezone.now().date()
        overdue_count = tasks_qs.filter(
            due_date__lt=today,
            status__in=['pending', 'in_progress']
        ).count()

        total_tasks = tasks_qs.count()
        completed = tasks_qs.filter(status='completed').count()
        completion_rate = (completed / total_tasks * 100) if total_tasks > 0 else 0

        # Recent tasks
        recent_tasks = tasks_qs.order_by('-created_at')[:5]
        recent_task_data = TaskSerializer(recent_tasks, many=True, context={'request': request}).data

        # Tasks by priority
        by_priority = {
            'high': tasks_qs.filter(priority='high').count(),
            'medium': tasks_qs.filter(priority='medium').count(),
            'low': tasks_qs.filter(priority='low').count(),
        }

        # Tasks by status
        by_status = {
            'pending': tasks_qs.filter(status='pending').count(),
            'in_progress': tasks_qs.filter(status='in_progress').count(),
            'completed': completed,
        }

        return Response({
            'total_projects': projects_qs.count(),
            'total_tasks': total_tasks,
            'completed_tasks': completed,
            'pending_tasks': tasks_qs.filter(status='pending').count(),
            'in_progress_tasks': tasks_qs.filter(status='in_progress').count(),
            'overdue_tasks': overdue_count,
            'completion_rate': round(completion_rate, 1),
            'by_priority': by_priority,
            'by_status': by_status,
            'recent_tasks': recent_task_data,
        })
