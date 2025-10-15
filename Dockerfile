FROM ghost:latest

# 루트 권한으로 필요한 도구 설치
USER root
RUN apt-get update && apt-get install -y --no-install-recommends gettext-base \
  && rm -rf /var/lib/apt/lists/*

# ✅ PostgreSQL 드라이버 추가 (Ghost가 Supabase 연결할 때 필요)
RUN npm install --prefix /var/lib/ghost/current pg

# ✅ S3 어댑터를 격리 경로에 설치 (의존성 충돌 회피)
RUN mkdir -p /var/lib/ghost/content/adapters/storage/s3 && \
    npm init -y --prefix /var/lib/ghost/content/adapters/storage/s3 && \
    npm install --prefix /var/lib/ghost/content/adapters/storage/s3 \
      --omit=dev --legacy-peer-deps ghost-storage-adapter-s3@latest

# ✅ config.template.json을 런타임에서도 접근 가능한 위치로 복사
COPY config.template.json /var/lib/ghost/config.template.json

# ✅ 엔트리포인트 스크립트 복사
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint-override.sh
RUN chown node:node /var/lib/ghost/config.template.json && \
    chmod +x /usr/local/bin/docker-entrypoint-override.sh

# 실행 유저 복귀
USER node
WORKDIR /var/lib/ghost

EXPOSE 2368
ENTRYPOINT ["/usr/local/bin/docker-entrypoint-override.sh"]
