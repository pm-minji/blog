FROM ghost:latest

# 루트 권한으로 필요한 도구 설치
USER root
RUN apt-get update && apt-get install -y --no-install-recommends gettext-base \
  && rm -rf /var/lib/apt/lists/*

# ✅ 어댑터를 '격리된 경로'에 설치하여 peer dependency 충돌 회피
#   Ghost는 content/adapters/storage/<name> 경로를 자동으로 인식합니다.
RUN mkdir -p /var/lib/ghost/content/adapters/storage/s3 && \
    npm init -y --prefix /var/lib/ghost/content/adapters/storage/s3 && \
    npm install --prefix /var/lib/ghost/content/adapters/storage/s3 \
      --omit=dev --legacy-peer-deps \
      ghost-storage-adapter-s3@latest

# 설정 템플릿/엔트리포인트 복사
COPY config.template.json /tmp/config.template.json
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint-override.sh
RUN chmod +x /usr/local/bin/docker-entrypoint-override.sh

# 실행 유저 및 작업 디렉토리 복귀
USER node
WORKDIR /var/lib/ghost

EXPOSE 2368
ENTRYPOINT ["/usr/local/bin/docker-entrypoint-override.sh"]
