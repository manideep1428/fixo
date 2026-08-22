from rest_framework.permissions import BasePermission


class IsOwner(BasePermission):
    """Object-level permission: only the owner (user FK) can access."""

    message = "You do not have permission to perform this action."

    def has_object_permission(self, request, view, obj):
        owner = getattr(obj, "user", None) or getattr(obj, "triggered_by", None)
        if owner is None:
            related = getattr(obj, "website", None)
            owner = getattr(related, "user", None) if related else None
        return owner == request.user
