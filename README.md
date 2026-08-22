# Fixora AI Studio

AI-powered website auditing & fixing platform. Add your websites, scan them for **SEO**, **Performance** (Core Web Vitals), and **Accessibility** (WCAG 2.1) issues, view scored reports, chat with an AI assistant, and get AI-generated fix suggestions.

| Part | Tech | Location |
|---|---|---|
| Frontend | Next.js 16 · React 19 · Tailwind 4 · shadcn/ui · Zustand · Bun | `fixora/` |
| Backend | Django 5 · DRF · JWT (SimpleJWT) · Channels (WebSockets) · httpx + BeautifulSoup scan engine | `backend/fixorabackend/` |
| Database | CockroachDB (production) / SQLite (local dev) | via `.env` |
| AI | Ollama local LLM (mistral / llama3.1:8b) — optional, has offline fallbacks | `http://localhost:11434` |

---

## 📁 Repository Layout

```
fixo/
├── fixora/                      # Next.js frontend
│   ├── app/dashboard/           # dashboard, scanners, reports, seo,
│   │                            # performance, accessibility, billing...
│   ├── services/
│   │   ├── apiClient.ts         # HTTP client (JWT + auto-refresh)
│   │   ├── backendService.ts    # typed wrappers for every endpoint
│   │   ├── scanSocket.ts        # WebSocket client for live scan progress
│   │   └── mockDataService.ts   # demo data (offline fallback)
│   └── store/                   # Zustand stores (websites/scans/ai/ui)
│
└── backend/fixorabackend/       # Django project
    ├── config/
    │   ├── settings.py          # main settings (CockroachDB + Redis)
    │   └── settings_migrate_local.py  # zero-dependency SQLite dev mode
    ├── apps/
    │   ├── authentication/      # JWT register/login/me
    │   ├── users/               # team members & profile
    │   ├── websites/            # website CRUD
    │   ├── scanners/            # ScanJob model + real scan engine
    │   ├── analysis/            # SEO / Performance / A11y results
    │   ├── ai_engine/           # AiFix suggestions + AI chat proxy
    │   ├── reports/             # executive audit reports
    │   └── billing/             # plans, subscription, usage stats
    ├── websockets/              # Channels consumer + routing
    └── core/                    # pagination, permissions
```

---

## ✅ Prerequisites

- **Python 3.10+**
- **Bun** (or Node.js 18+) — [bun.sh](https://bun.sh)
- *(optional)* **CockroachDB** instance — free tier at [cockroachlabs.cloud](https://www.cockroachlabs.cloud/)
- *(optional)* **Ollama** — `curl -fsSL https://ollama.com/install.sh | sh && ollama pull mistral`
- *(optional)* **Redis** — only needed for multi-process WebSocket scaling

> Everything runs without the optionals: the backend falls back to SQLite +
> in-memory channels, and AI replies fall back to built-in heuristics.

---

## 🚀 Quick Start (local dev, no external services)

### 1. Backend

```bash
cd backend/fixorabackend

# create venv + install dependencies
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# copy the env template (defaults work out of the box)
cp .env.example .env

# create tables + run the server (HTTP + WebSockets on :8100)
export DJANGO_SETTINGS_MODULE=config.settings_migrate_local
python manage.py migrate
daphne -p 8100 config.asgi:application
```

Backend is now live:
- REST API → `http://localhost:8100/api/...`
- WebSockets → `ws://localhost:8100/ws/scans/<SCAN_ID>/`
- Admin → `http://localhost:8100/admin/` (create a superuser first: `python manage.py createsuperuser`)

> **Why daphne?** It serves both HTTP *and* WebSockets via ASGI.
> `python manage.py runserver` works too but is HTTP-only in this setup.

### 2. Frontend

```bash
cd fixora

bun install

# point the frontend at the backend
echo 'NEXT_PUBLIC_API_URL=http://localhost:8100' > .env.local

bun dev
```

Open **http://localhost:3000** — the landing page renders, and every
dashboard page pulls real data from the backend. If the backend is stopped,
the UI gracefully falls back to demo data instead of breaking.

---

## 🗄️ Production Database (CockroachDB)

Fill `.env` with your CockroachCloud credentials:

```env
SECRET_KEY=a-long-random-secret
DEBUG=False

DB_NAME=<database-name>
DB_USER=<username>
DB_PASSWORD=<password>
DB_HOST=free-tier.gcp-us-east1.cockroachlabs.cloud
DB_PORT=26257
```

Then:

```bash
unset DJANGO_SETTINGS_MODULE          # use the real config/settings.py
python manage.py migrate              # creates all tables in CockroachCloud
daphne config.asgi:application        # server now uses the cloud DB
```

No code changes required — the same ORM code runs on both backends.
If your provider requires `sslmode=verify-full`, add the CA cert path to
`DATABASES["default"]["OPTIONS"]["sslrootcert"]` in `config/settings.py`.

### Redis (optional, production scale-out)
Set `REDIS_URL=redis://localhost:6379/0` in `.env` to move the channel layer
and cache off the in-memory fallback.

---

## 🔌 API Overview

All endpoints are JWT-protected (except `register`, `login`, `plans`).
Send `Authorization: Bearer <access_token>` on every request.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register/` | Create account `{username, email, password}` |
| POST | `/api/auth/login/` | Get JWT tokens `{access, refresh}` |
| POST | `/api/auth/token/refresh/` | Refresh access token |
| GET/PATCH | `/api/auth/me/` | Current user profile |
| GET/POST | `/api/websites/` | List / create websites |
| GET/PATCH/DELETE | `/api/websites/<WEB-ID>/` | Retrieve / update / delete |
| GET | `/api/scans/` | Scan history |
| POST | `/api/scans/start/` | Launch scan `{website_id}` |
| GET | `/api/scans/<SCAN-ID>/` | Full results (seo/performance/accessibility/ai_fixes) |
| GET | `/api/analysis/results/latest/?website=<WEB-ID>` | Latest result per type |
| GET | `/api/ai/fixes/?scan=<SCAN-ID>` | AI fix suggestions |
| POST | `/api/ai/fixes/<FIX-ID>/apply/` | Toggle fix applied state |
| GET/POST | `/api/ai/chat/` | Chat history / send message (Ollama-backed) |
| GET | `/api/reports/` | Audit reports |
| GET | `/api/billing/plans/` | Subscription plans (public) |
| GET | `/api/billing/usage/` | Usage statistics |

**WebSocket**

```
ws://localhost:8100/ws/scans/<SCAN-ID>/
```

Receives frames like:

```json
{ "type": "scan.update",
  "data": { "id": "SCAN-X", "status": "running", "progress": 45,
            "current_step": "Evaluating performance metrics..." } }
```

State is replayed on connect; send `{"type":"ping"}` as keepalive.

---

## 🧪 Testing

### Backend

```bash
cd backend/fixorabackend && source .venv/bin/activate

# 1. system checks (models, URLs, settings)
DJANGO_SETTINGS_MODULE=config.settings_migrate_local python manage.py check

# 2. apply all migrations cleanly
DJANGO_SETTINGS_MODULE=config.settings_migrate_local python manage.py migrate

# 3. full end-to-end pipeline test — spins up a local test page,
#    registers a user, creates a website, runs a REAL scan, and verifies
#    scores / AI fixes / report / WebSocket replay (script below)
PYTHONPATH=. DJANGO_SETTINGS_MODULE=config.settings_migrate_local python e2e_test.py
```

<details>
<summary><b>E2E test script</b> (save as <code>e2e_test.py</code> in backend root)</summary>

```python
import os, threading, asyncio
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings_migrate_local')
import django; django.setup()

from http.server import HTTPServer, BaseHTTPRequestHandler
class H(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200); self.send_header('Content-Type','text/html'); self.end_headers()
        self.wfile.write(b'<html><head><title>T</title></head><body><h1>Hi</h1>'
                         b'<img src="x.png"><p>seo content here</p></body></html>')
    def log_message(self, *a): pass
srv = HTTPServer(('127.0.0.1', 18899), H)
threading.Thread(target=srv.serve_forever, daemon=True).start()

from rest_framework.test import APIClient
from apps.authentication.models import User
User.objects.filter(username='t1').delete()
c = APIClient()
c.post('/api/auth/register/', {'username':'t1','email':'t@x.io','password':'Str0ngPass!x'}, format='json')
tok = c.post('/api/auth/login/', {'username':'t1','password':'Str0ngPass!x'}, format='json').data['access']
c.credentials(HTTP_AUTHORIZATION=f'Bearer {tok}')
web = c.post('/api/websites/', {'name':'T','url':'http://127.0.0.1:18899/'}, format='json').data['id']
scan = c.post('/api/scans/start/', {'website_id': web}, format='json').data['id']

import time; time.sleep(5)
r = c.get(f'/api/scans/{scan}/').json()
assert r['status'] == 'completed', r
print('SEO:', r['results']['seo']['score'], '| PERF:', r['results']['performance']['score'])
print('A11Y issues:', len(r['results']['accessibility']['issues']))
print('Reports:', len(c.get('/api/reports/').data))

from channels.testing import WebsocketCommunicator
from config.asgi import application
async def ws():
    comm = WebsocketCommunicator(application, f'/ws/scans/{scan}/')
    assert (await comm.connect())[0]
    msg = await comm.receive_json_from(timeout=5)
    print('WS replay:', msg['data']['status'], msg['data']['progress'])
    await comm.disconnect()
asyncio.run(ws())
print('ALL TESTS PASSED')
```

</details>

### Frontend

```bash
cd fixora

bun run typecheck     # TypeScript strict check across the whole app
bun run lint          # ESLint (some warnings pre-exist upstream)
bun run build         # full production compile
```

### Manual smoke test (full stack)

```bash
# terminal 1 — backend
cd backend/fixorabackend && source .venv/bin/activate
DJANGO_SETTINGS_MODULE=config.settings_migrate_local python manage.py migrate
daphne -p 8100 config.asgi:application

# terminal 2 — frontend
cd fixora && NEXT_PUBLIC_API_URL=http://localhost:8100 bun dev
```

Then walk through: **Dashboard → Add Website → Rescan** — you should see live
progress steps stream over the WebSocket, then real SEO/Perf/A11y scores on
the category pages and a report appear under PDF Reports.

---

## 🧠 AI (Ollama)

The AI assistant and fix generation use a local Ollama instance — no API keys,
no cloud costs.

```bash
ollama pull mistral        # default model (llama3.1:8b also supported)
```

- The browser chat panel calls backend `/api/ai/chat/`, which proxies to
  Ollama and stores history in the DB.
- If Ollama isn't reachable, the backend returns built-in heuristic guidance
  so the UX never breaks.
- Configure URL via the `OLLAMA_URL` env var (default `http://localhost:11434`).

---

## 📦 Environment Variables Reference

**Backend (`backend/fixorabackend/.env`)**

| Var | Required | Default | Purpose |
|---|---|---|---|
| `SECRET_KEY` | yes | — | Django secret |
| `DEBUG` | no | `False` | Debug mode |
| `DB_NAME` / `DB_USER` / `DB_PASSWORD` / `DB_HOST` / `DB_PORT` | prod | empty | CockroachDB connection |
| `REDIS_URL` | no | empty | Redis for cache/channels (empty = in-memory) |
| `OLLAMA_URL` | no | `http://localhost:11434` | Local LLM server |

**Frontend (`fixora/.env.local`)**

| Var | Required | Default | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | no | `http://localhost:8000` | Backend base URL (HTTP+WS) |
| `NEXT_PUBLIC_OLLAMA_URL` | no | `http://localhost:11434` | Direct Ollama fallback |

---

## 🐛 Troubleshooting

| Symptom | Fix |
|---|---|
| `ImproperlyConfigured: ... supply the NAME` | Using production settings without DB values in `.env`. Fill them or export `DJANGO_SETTINGS_MODULE=config.settings_migrate_local`. |
| Port already in use | Another process owns it — pick another port: `daphne -p 8200 ...` |
| Frontend shows demo data | Backend unreachable — check daphne is running and `NEXT_PUBLIC_API_URL` matches its port. |
| WebSocket connects but no updates | Start the server with **daphne** (ASGI), not WSGI-only gunicorn. |
| Scans fail with `Connection refused` | Target website URL is unreachable from the backend machine. |

---

## 📄 License

Private project — © Fixora AI.
