# Ghost 버전 고정 (latest 대신 고정 태그 권장)
FROM ghost:6.3.1

# npm 잡무 비활성화(속도/로그 깔끔)
ENV NPM_CONFIG_AUDIT=false \
    NPM_CONFIG_FUND=false

# 루트로 필요한 툴/패키지 설치 + 한 번에 실행(레이어 최소화)
USER root
RUN apt-get update && apt-get install -y --no-install-recommends gettext-base \
  && rm -rf /var/lib/apt/lists/* \
  # ✅ PostgreSQL 드라이버를 "버전 디렉토리"에서 설치 (경로 꼬임/peer 충돌 우회)
  && sh -lc 'cd /var/lib/ghost/versions/* && npm install --omit=dev --legacy-peer-deps pg' \
  # ✅ S3 어댑터를 "격리 경로"에 설치 (Ghost가 자동 로드)
  && mkdir -p /var/lib/ghost/content/adapters/storage/s3 \
  && npm init -y --prefix /var/lib/ghost/content/adapters/storage/s3 \
  && npm install --prefix /var/lib/ghost/content/adapters/storage/s3 --omit=dev --legacy-peer-deps ghost-storage-adapter-s3@latest

# 설정 템플릿/엔트리포인트 배치
COPY config.template.json /var/lib/ghost/config.template.json
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint-override.sh

# 권한 정리
RUN chown node:node /var/lib/ghost/config.template.json \
  && chmod +x /usr/local/bin/docker-entrypoint-override.sh

# 실행 유저/작업 디렉토리
USER node
WORKDIR /var/lib/ghost

EXPOSE 2368
ENTRYPOINT ["/usr/local/bin/docker-entrypoint-override.sh"]
