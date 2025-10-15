#!/bin/sh
set -e

: "${APP_URL:?Need APP_URL}"
: "${DATABASE_URL:?Need DATABASE_URL}"
: "${S3_ACCESS_KEY:?Need S3_ACCESS_KEY}"
: "${S3_SECRET_KEY:?Need S3_SECRET_KEY}"
: "${S3_BUCKET:?Need S3_BUCKET}"
: "${S3_REGION:?Need S3_REGION}"
: "${S3_ENDPOINT:?Need S3_ENDPOINT}"

# 템플릿 -> 실제 설정 생성 (경로를 /app 기준으로 변경)
envsubst < /app/config.template.json > /var/lib/ghost/config.production.json

exec ghost run
