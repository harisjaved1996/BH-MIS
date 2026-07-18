from rest_framework import viewsets


class AuditModelViewSet(viewsets.ModelViewSet):
    """ModelViewSet that stamps audit fields from the authenticated admin."""

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, updated_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(updated_by=self.request.user)
