#!/bin/sh
set -e

# 필수 환경변수 점검(없으면 실패하도록)
: "${APP_URL:?Need APP_URL}"
: "${DATABASE_URL:?Need DATABASE_URL}"
: "${S3_ACCESS_KEY:?Need S3_ACCESS_KEY}"
: "${S3_SECRET_KEY:?Need S3_SECRET_KEY}"
: "${S3_BUCKET:?Need S3_BUCKET}"
: "${S3_REGION:?Need S3_REGION}"
: "${S3_ENDPOINT:?Need S3_ENDPOINT}"

# 템플릿 → 실제 설정 생성
envsubst < /tmp/config.template.json > /var/lib/ghost/config.production.json

# Ghost 실행
exec ghost run
