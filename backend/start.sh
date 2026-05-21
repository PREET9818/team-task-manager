#!/bin/bash
set -e
echo "==> Running migrations..."
python3 manage.py migrate --no-input
echo "==> Collecting static..."
python3 manage.py collectstatic --no-input --clear
echo "==> Starting server..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers 2 --timeout 120