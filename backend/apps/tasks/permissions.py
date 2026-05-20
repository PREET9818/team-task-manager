from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsTaskOwnerOrAdmin(BasePermission):
    """Admin can do anything. Members can only update status of their own tasks."""
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.role == 'admin':
            return True
        if request.method in SAFE_METHODS:
            return obj.assigned_to == user or obj.created_by == user
        # Members can update status only
        if view.action == 'update_status':
            return obj.assigned_to == user
        return False


class CanCreateTask(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin'
