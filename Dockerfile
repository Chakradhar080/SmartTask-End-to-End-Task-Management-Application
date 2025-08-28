FROM python:3.11-slim

WORKDIR /app

# Install netcat for wait-for-db.sh
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ./app ./app
COPY wait-for-db.sh /app/wait-for-db.sh
RUN chmod +x /app/wait-for-db.sh

CMD ["/app/wait-for-db.sh", "db", "3306", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
