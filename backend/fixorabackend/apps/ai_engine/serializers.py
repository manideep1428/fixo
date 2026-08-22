from rest_framework import serializers
from .models import AiFix, AiChatMessage


class AiFixSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="fix_id", read_only=True)

    class Meta:
        model = AiFix
        fields = (
            "id", "issue_type", "severity", "title", "description",
            "fix_code", "affected_file", "line_number", "model_used",
            "confidence", "applied",
        )


class AiChatMessageSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="message_id", read_only=True)
    model = serializers.CharField(source="model_used", read_only=True)

    class Meta:
        model = AiChatMessage
        fields = ("id", "role", "content", "model", "created_at")
