import os
from datetime import datetime, timezone as dt_timezone

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response

from apps.scanners.models import ScanJob
from .models import AiFix, AiChatMessage
from .serializers import AiFixSerializer, AiChatMessageSerializer
from apps.scanners.services import ask_ollama
from .services import build_chat_reply

OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434")


class AiFixViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "fix_id"
    serializer_class = AiFixSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = AiFix.objects.filter(scan__triggered_by=self.request.user)
        scan_id = self.request.query_params.get("scan")
        if scan_id:
            queryset = queryset.filter(scan__scan_id=scan_id)
        return queryset

    @action(detail=True, methods=["post"], url_path="apply")
    def apply(self, request, pk=None):
        fix = self.get_object()
        fix.applied = not fix.applied
        fix.save(update_fields=["applied"])
        return Response(AiFixSerializer(fix).data)


@api_view(["GET", "POST"])
@permission_classes([permissions.IsAuthenticated])
def chat(request):
    """AI chat backed by local Ollama; falls back to heuristic replies."""
    if request.method == "GET":
        messages = AiChatMessage.objects.filter(user=request.user)
        return Response(AiChatMessageSerializer(messages, many=True).data)

    content = (request.data.get("content") or "").strip()
    model = request.data.get("model") or "mistral"
    scan_id = request.data.get("scan_id")

    if not content:
        return Response({"detail": "content is required"}, status=status.HTTP_400_BAD_REQUEST)

    scan = None
    if scan_id:
        scan = ScanJob.objects.filter(scan_id=scan_id, triggered_by=request.user).first()

    user_msg = AiChatMessage.objects.create(
        user=request.user, scan=scan, role="user", content=content,
    )

    reply_text = ask_ollama(content, model, OLLAMA_URL)
    if reply_text is None:
        reply_text = build_chat_reply(content)

    assistant_msg = AiChatMessage.objects.create(
        user=request.user, scan=scan, role="assistant",
        content=reply_text, model_used=model,
    )

    return Response(AiChatMessageSerializer(assistant_msg).data, status=status.HTTP_201_CREATED)
