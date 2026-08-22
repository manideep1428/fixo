import json

from channels.generic.websocket import AsyncJsonWebsocketConsumer


class ScanProgressConsumer(AsyncJsonWebsocketConsumer):
    """Streams live scan progress: ws://host/ws/scans/<scan_id>/"""

    async def connect(self):
        self.scan_id = self.scope["url_route"]["kwargs"]["scan_id"]
        self.group_name = f"scan_{self.scan_id}"

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Replay current state so late joiners are in sync
        from channels.db import database_sync_to_async
        state = await self._current_state()
        if state:
            await self.send_json({"type": "scan.update", "data": state})

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive_json(self, content, **kwargs):
        # Simple ping/pong keepalive
        if content.get("type") == "ping":
            await self.send_json({"type": "pong"})

    async def scan_update(self, event):
        await self.send_json({
            "type": "scan.update",
            "data": event["data"],
        })

    async def _current_state(self):
        from channels.db import database_sync_to_async

        @database_sync_to_async
        def load():
            from apps.scanners.models import ScanJob
            try:
                scan = ScanJob.objects.get(scan_id=self.scan_id)
            except ScanJob.DoesNotExist:
                return None
            data = {
                "id": scan.scan_id,
                "website_id": scan.website.website_id,
                "status": scan.status,
                "progress": scan.progress,
                "current_step": scan.current_step,
            }
            if scan.error:
                data["error"] = scan.error
            return data

        return await load()
