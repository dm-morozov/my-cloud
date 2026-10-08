FROM python:3.14-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt && useradd --uid 10001 --create-home app
COPY . .
RUN mkdir -p storage/media storage/static && chown -R app:app storage
USER app
EXPOSE 8000
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "1", "--threads", "2", "--timeout", "120", "--access-logfile", "-", "--error-logfile", "-"]
