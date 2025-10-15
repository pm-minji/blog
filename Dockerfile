FROM ghost:latest

# 루트 권한으로 필요한 도구 설치
USER root
RUN apt-get update && apt-get install -y --no-install-recommends gettext-base \
  && rm -rf /var/lib/apt/lists/*

# ✅ PostgreSQL 드라이버(충돌 우회) 설치
RUN npm install --prefix /var/lib/ghost/current --omit=dev --legacy-peer-deps pg

# ✅ S3 어댑터를 격리 경로에 설치 (의존성 충돌 회피)
RUN mkdir -p /var/lib/ghost/content/adapters/storage/s3 && \
    npm init -y --prefix /var/lib/ghost/content/adapters/storage/s3 && \
    npm install --prefix /var/lib/ghost/content/adapters/storage/s3 \
      --omit=dev --legacy-peer-deps ghost-storage-adapter-s3@latest

# 설정 템플릿/엔트리포인트
COPY config.template.json /var/lib/ghost/config.template.json
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint-override.sh
RUN chown node:node /var/lib/ghost/config.template.json && \
    chmod +x /usr/local/bin/docker-entrypoint-override.sh

# 실행 유저/작업 디렉토리
USER node
WORKDIR /var/lib/ghost
EXPOSE 2368
ENTRYPOINT ["/usr/local/bin/docker-entrypoint-override.sh"]
