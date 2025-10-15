FROM ghost:latest

# envsubst 사용 및 S3 어댑터 설치
RUN apt-get update && apt-get install -y --no-install-recommends gettext-base \
  && rm -rf /var/lib/apt/lists/* \
  && npm install ghost-storage-adapter-s3

# 템플릿/엔트리포인트 복사
COPY config.template.json /tmp/config.template.json
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 2368
ENTRYPOINT ["/docker-entrypoint.sh"]
