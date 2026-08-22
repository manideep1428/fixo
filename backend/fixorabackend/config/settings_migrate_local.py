# Local development settings: SQLite DB so the app runs without CockroachDB/Redis.
# Usage: DJANGO_SETTINGS_MODULE=config.settings_migrate_local python manage.py runserver

from config.settings import *  # noqa

DATABASES = {"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": "/tmp/fixora_test.db"}}
