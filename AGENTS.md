# Video App — Agent Context

A full-stack Dockerised web application for browsing, tagging, and playing video and image files stored on disk. Users access the app via a browser; the backend serves files and metadata from the host filesystem.

---

## Stack

| Layer    | Tech                                                      |
|----------|-----------------------------------------------------------|
| Frontend | React (CRA), TypeScript, MobX, MUI, Axios                |
| Backend  | Node.js, Express, TypeScript, TypeORM (`synchronize: true`) |
| Database | PostgreSQL 14                                             |
| Runtime  | Docker Compose (`./start.sh` → `docker compose up`)       |

**Ports:** frontend `3000`, backend `5001`, postgres `5432`.

The backend connects to postgres at the hardcoded host `host.docker.internal` (works via Docker Desktop on Mac). The DB name comes from `DBNAME` in `server/.env`.

---

## Directory layout

```
video-app/
├── start.sh                  # runs docker compose up/down
├── docker-compose.yml        # root compose: database + server + client
├── client/                   # React frontend
│   ├── src/
│   │   ├── api/agent.ts      # all Axios API calls (single source of truth)
│   │   ├── models/           # TypeScript interfaces mirroring backend entities
│   │   ├── store/            # MobX stores (tags_store, queries_store, …)
│   │   └── components/       # feature-organised React components
│   └── Dockerfile
└── server/                   # Express backend
    ├── src/
    │   ├── app.ts            # Express setup, TypeORM connection, route mounting
    │   ├── start.ts          # app.listen entry point
    │   ├── models/           # TypeORM entities (see below)
    │   ├── controllers/      # route definitions
    │   ├── handlers/         # one file per endpoint, imported by controllers
    │   └── lib/              # shared utilities (VideoSearcher, SearchQuery, …)
    ├── .env                  # PORT=5001, DBNAME=videodb, DATADIR, TESTDATADIR, SCRIPT_SECRET
    └── Dockerfile
```

---

## Database models

TypeORM `synchronize: true` — schema is derived from decorators, no migration files.

### `VideoMeta`
The core entity. Represents a single video file on disk.

| Field             | Type      | Notes                                  |
|-------------------|-----------|----------------------------------------|
| `id`              | int PK    |                                        |
| `name`            | text      | filename without extension             |
| `path`            | text      | absolute path on disk                  |
| `parent_path`     | text      | directory path                         |
| `rating`          | int       | 0–10                                   |
| `duration_sec`    | decimal   | probed via ffmpeg                      |
| `width` / `height`| decimal   | resolution                             |
| `size_mb`         | int       |                                        |
| `views`           | int       |                                        |
| `created_at`      | timestamptz |                                      |
| `rating_size_value` | float   | computed quality score                 |
| `tags`            | Tag[]     | many-to-many                           |
| `series`          | Series    | many-to-one (nullable)                 |
| `thumbnail`       | ImageMeta | one-to-one (nullable)                  |
| `gallery`         | ImageGallery | one-to-one (nullable)               |
| `file_scripts`    | FileScript[] | many-to-many                        |

When a new video is discovered, its directory path is split into segments and each segment becomes a Tag that is auto-applied to the video.

### `Tag`
Flexible label entity used for content tagging and also as a container for playlists.

| Field                  | Type    | Notes                                              |
|------------------------|---------|----------------------------------------------------|
| `id`                   | int PK  |                                                    |
| `name`                 | text    |                                                    |
| `is_playlist`          | bool    | static playlist (uses `playlist_included_tags`)    |
| `is_dynamic_playlist`  | bool    | playlist driven by `PersistentQuery` sequence      |
| `is_character`         | bool    |                                                    |
| `is_series`            | bool    |                                                    |
| `is_studio`            | bool    | streaming service / production company             |
| `is_script`            | bool    | linked to a `FileScript`                           |
| `default_excluded`     | bool    | excluded from searches by default                  |
| `default_hidden`       | bool    | hidden from Latest/Discover/Popular feeds          |
| `playlist_included_tags` | Tag[] | extra tag filters applied when this tag is a playlist |
| `child_tags`           | Tag[]   | many-to-many self-referential hierarchy            |

Exactly one `is_*` flag should be true at a time; `make_studio()`, `make_playlist()`, etc. enforce this.

### `PersistentQuery`
A saved search filter used as a building block for dynamic playlists.

| Field             | Type    | Notes                              |
|-------------------|---------|------------------------------------|
| `id`              | int PK  |                                    |
| `name`            | text    |                                    |
| `included_tags`   | Tag[]   | video must have ALL of these       |
| `excluded_tags`   | Tag[]   | video must have NONE of these      |
| `studios`         | Tag[]   | video must have AT LEAST ONE of these (all must have `is_studio=true`) |
| `search_text`     | text    | LIKE filter on `video.path`        |
| `min_rating`      | int     | 0–10                               |
| `max_rating`      | int     | 0–10                               |
| `min_duration_sec`| decimal |                                    |
| `max_duration_sec`| decimal |                                    |
| `frame_height`    | decimal | minimum resolution                 |

### `PersistentQueryToPlaylist`
Junction table linking a `PersistentQuery` to a dynamic playlist, carrying an `order` (1-indexed position in the playlist). Has two playlist FK columns: `playlist` (Tag) and `playlist_2` (Playlist entity) to support both playlist representations.

### `Playlist`
A named sequence of persistent queries (an alternative to the Tag-based dynamic playlist).

| Field            | Type    | Notes                                       |
|------------------|---------|---------------------------------------------|
| `id`             | int PK  |                                             |
| `name`           | text    |                                             |
| `included_tags`  | Tag[]   | extra tag filters applied to every query    |

### `Series`
An ordered collection of videos (e.g. a TV show).

### `ImageMeta` / `ImageGallery`
Represent individual images and collections of images. Galleries and thumbnails can be associated with videos.

### `FileScript`
Shell scripts that can be associated with tags or individual videos/galleries and executed from the UI (activation / deactivation scripts, bulk operations).

---

## Search / filtering (`SearchQuery` + `VideoSearcher`)

`SearchQuery` (`server/src/lib/search_query.ts`) is the central query-parameter object:

```
searched_text, included_tags, excluded_tags, studios,
min_rating, max_rating, min_resolution, page, page_capacity,
order_by, order_strategy, thumb_status
```

`VideoSearcher` (`server/src/lib/videos_lib/video_searcher.ts`) turns a `SearchQuery` into a TypeORM `SelectQueryBuilder`:

- **included_tags** — SQL `HAVING COUNT(DISTINCT tag.id) = N` (video must carry ALL tags)
- **excluded_tags** — `NOT IN` subquery (video must carry NONE of these tags)
- **studios** — `IN` subquery without HAVING (video must carry AT LEAST ONE studio tag)
- **text** — `video.path LIKE '%text%'`
- **rating / resolution** — simple `>=` / `<=` column filters

`PersistentQuery.build_search_query()` converts a stored query into a `SearchQuery` and passes it to `VideoSearcher`. `find_video()` returns a single random result; `find_videos()` returns a paginated random set.

---

## Dynamic playlist flow

1. A `Tag` with `is_dynamic_playlist = true` owns an ordered list of `PersistentQuery` records via `PersistentQueryToPlaylist` rows.
2. `GET /api/tags/dynamic-playlist/:tag_id/order/:order` finds the query at that position, optionally merges the playlist's `playlist_included_tags` into it, then calls `PersistentQuery.find_video()`.
3. The response includes the video, the current order, and the next order — the frontend steps through these to play the playlist sequentially.
4. The `Playlist` entity provides an equivalent mechanism (`GET /api/playlists/:id/video/:order`).

---

## Key API routes

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/videos/:id` | video details |
| GET | `/api/search` | paginated video search |
| GET | `/api/tags` | all tags |
| GET | `/api/tags/studios` | only studio tags |
| GET | `/api/tags/dynamic-playlist/:id/order/:n` | next playlist video |
| GET/POST/PUT/DELETE | `/api/persistent-queries` | CRUD for persistent queries |
| PUT | `/api/persistent-queries/preview-videos` | preview videos matching a query |
| GET/POST/PUT/DELETE | `/api/playlists` | CRUD for playlists |
| GET | `/api/playlists/:id/video/:order` | next playlist video (Playlist entity) |
| GET | `/api/cleanup/*` | maintenance tasks (scan new videos, remove missing, etc.) |

---

## Frontend conventions

- **`client/src/api/agent.ts`** — single file containing every API call; always update here when adding endpoints.
- **`client/src/models/`** — TypeScript interfaces (`IPersistentQuery`, `ITag`, `IVideoMeta`, …) that mirror the backend entities; keep in sync with backend model changes.
- **MobX stores** — `TagsStore` holds the global tag list and the currently selected included/excluded tag sets for the search form. Query-specific state (e.g. studios) is kept as local `useState` inside form components.
- **`TagSelector`** — generic autocomplete for included/excluded tags (uses all tags). **`StudioSelector`** — dedicated autocomplete that fetches only `is_studio=true` tags via `Tag.studios()`.
