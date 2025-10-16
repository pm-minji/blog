FROM ghost:latest

USER root
RUN apt-get update && apt-get install -y --no-install-recommends gettext-base \
  && rm -rf /var/lib/apt/lists/*

# ✅ PostgreSQL 드라이버를 Ghost "버전" 디렉토리에서 설치 (경로 꼬임 방지 + peer 충돌 우회)
RUN sh -lc 'cd /var/lib/ghost/versions/* && npm install --omit=dev --legacy-peer-deps pg'

# ✅ S3 어댑터를 격리 경로에 설치 (Ghost가 자동 인식)
RUN mkdir -p /var/lib/ghost/content/adapters/storage/s3 && \
    npm init -y --prefix /var/lib/ghost/content/adapters/storage/s3 && \
    npm install --prefix /var/lib/ghost/content/adapters/storage/s3 \
      --omit=dev --legacy-peer-deps ghost-storage-adapter-s3@latest

# 설정 템플릿/엔트리포인트
COPY config.template.json /var/lib/ghost/config.template.json
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint-override.sh
RUN chown node:node /var/lib/ghost/config.template.json && \
    chmod +x /usr/local/bin/docker-entrypoint-override.sh

USER node
WORKDIR /var/lib/ghost
EXPOSE 2368
ENTRYPOINT ["/usr/local/bin/docker-entrypoint-override.sh"]
