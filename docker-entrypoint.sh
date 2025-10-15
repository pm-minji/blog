#!/bin/sh
set -e

: "${APP_URL:?Need APP_URL}"
: "${DATABASE_URL:?Need DATABASE_URL}"
: "${S3_ACCESS_KEY:?Need S3_ACCESS_KEY}"
: "${S3_SECRET_KEY:?Need S3_SECRET_KEY}"
: "${S3_BUCKET:?Need S3_BUCKET}"
: "${S3_REGION:?Need S3_REGION}"
: "${S3_ENDPOINT:?Need S3_ENDPOINT}"

# ⬇️ /tmp 대신 /var/lib/ghost 경로 사용
envsubst < /var/lib/ghost/config.template.json > /var/lib/ghost/config.production.json

# 공식 이미지 실행 방식
exec node current/index.js
