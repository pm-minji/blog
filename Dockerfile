FROM ghost:latest

# 루트 권한으로 패키지/어댑터 설치
USER root

# envsubst(템플릿 치환용) 설치
RUN apt-get update && apt-get install -y --no-install-recommends gettext-base \
  && rm -rf /var/lib/apt/lists/*

# S3 스토리지 어댑터는 Ghost 앱 폴더(/var/lib/ghost/current)에 설치해야 인식됨
RUN cd /var/lib/ghost/current && npm install --production ghost-storage-adapter-s3

# 템플릿/엔트리포인트 복사
COPY config.template.json /tmp/config.template.json
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint-override.sh
RUN chmod +x /usr/local/bin/docker-entrypoint-override.sh

# 실행 유저/작업 디렉토리 복귀
USER node
WORKDIR /var/lib/ghost

EXPOSE 2368
ENTRYPOINT ["/usr/local/bin/docker-entrypoint-override.sh"]
