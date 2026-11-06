# Music API (CST-391 Milestone 3)

Express + TypeScript + MySQL REST API for the Music App mood feature
(admins set a default mood per album; customers can override it for themselves).

## Setup (exact steps)
1. Install Node.js 18+ and MySQL (MAMP or MySQL Server).
2. In MySQL Workbench, open `sql/schema.sql` and click the lightning-bolt **Execute** button. This creates the `music` database, tables, and sample data.
3. In this folder, copy `.env.example` to a new file named `.env` and put your own MySQL password in `DB_PASSWORD` (and your user in `DB_USER`).
4. In a terminal in this folder, run `npm install`.
5. Run `npm run dev`. You should see: `Music API listening on http://localhost:5000/api`.
6. In Postman, click **Import** and choose `postman/MusicAPI.postman_collection.json`. Run the requests in the order Create, Read, Update, Delete.

## Structure
- `src/routes` URL to controller mapping
- `src/controllers` request validation and responses
- `src/daos` all SQL (parameterized queries)
- `sql/schema.sql` tables: moods, users, albums, user_album_moods

## Endpoints
| Method | Path | Purpose |
|---|---|---|
| GET | /api/moods | List moods |
| GET | /api/albums | List albums |
| POST | /api/albums | Create album |
| GET | /api/albums/:albumId | Read one album |
| PUT | /api/albums/:albumId | Update album |
| DELETE | /api/albums/:albumId | Delete album |
| GET | /api/albums/mood/:moodId | Albums matching a mood |
| GET | /api/albums/:albumId/mood | Effective mood for current user |
| PUT | /api/albums/:albumId/mood | Set default mood |
| PUT | /api/albums/:albumId/personal-mood | Set personal mood (X-User-Id) |
| DELETE | /api/albums/:albumId/personal-mood | Remove personal mood (X-User-Id) |

## Known limitations
- No authentication this milestone: the "current user" comes from the `X-User-Id` header, and admin-only endpoints are not yet restricted.
