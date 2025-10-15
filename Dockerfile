FROM ghost:latest

# 루트 권한으로 도구 설치
USER root
RUN apt-get update && apt-get install -y --no-install-recommends gettext-base \
  && rm -rf /var/lib/apt/lists/*

# S3 어댑터를 '격리 경로'에 설치(의존성 충돌 회피)
RUN mkdir -p /var/lib/ghost/content/adapters/storage/s3 && \
    npm init -y --prefix /var/lib/ghost/content/adapters/storage/s3 && \
    npm install --prefix /var/lib/ghost/content/adapters/storage/s3 \
      --omit=dev --legacy-peer-deps ghost-storage-adapter-s3@latest

# ⬇️ 템플릿을 /var/lib/ghost 로 복사 (런타임에 항상 보이는 경로)
COPY config.template.json /var/lib/ghost/config.template.json
# 엔트리포인트 스크립트 배치
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint-override.sh

# 권한 정리 (node 유저가 읽을 수 있게)
RUN chown node:node /var/lib/ghost/config.template.json && \
    chmod +x /usr/local/bin/docker-entrypoint-override.sh

# 실행 유저/작업 디렉토리
USER node
WORKDIR /var/lib/ghost

EXPOSE 2368
ENTRYPOINT ["/usr/local/bin/docker-entrypoint-override.sh"]
