# Task Manager API (FastAPI + MySQL + JWT)

## Quickstart (local)
1. Update `app/database.py` DATABASE_URL if you are not using docker.
2. Create MySQL database and user if not using docker:
   - CREATE DATABASE taskdb;
   - CREATE USER 'taskuser'@'localhost' IDENTIFIED BY 'taskpass';
   - GRANT ALL PRIVILEGES ON taskdb.* TO 'taskuser'@'localhost';
   - FLUSH PRIVILEGES;
3. Install dependencies:
   ```
   python -m venv venv
   source venv/bin/activate   # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
4. Run:
   ```
   uvicorn app.main:app --reload
   ```
5. Open Swagger UI: http://127.0.0.1:8000/docs

## Using Docker Compose
```
docker-compose up --build
```
## Quickstart (Frontend - React)
1. Navigate to the frontend folder:
```
cd frontend
```
2. Install dependencies:
```
npm install
```
3. Run the development server:
```
npm start
```
or
```
npm run dev
```
4. The frontend will run at: http://localhost:3000
Make sure your backend (FastAPI) is running at port 8000 before testing the frontend.

## Notes
- Change SECRET_KEY in app/auth.py before production.
- Docker compose sets DB credentials: taskuser/taskpass (root: rootpass).
"# SmartTask-End-to-End-Task-Management-Application" 
