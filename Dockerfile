FROM ghost:latest
ENV NODE_ENV=production

# envsubst + s3 어댑터
RUN apt-get update && apt-get install -y --no-install-recommends gettext-base \
  && rm -rf /var/lib/apt/lists/* \
  && npm install ghost-storage-adapter-s3

# 리포 전체를 /app 으로 복사 (컨텍스트 누락 방지)
WORKDIR /app
COPY . /app

# 디버그: 파일이 실제로 들어왔는지 빌드 로그에 출력하고 없으면 실패
RUN ls -al /app && test -f /app/config.template.json
RUN head -n 1 /app/config.template.json || true

# 엔트리포인트 준비
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 2368
ENTRYPOINT ["/app/docker-entrypoint.sh"]
