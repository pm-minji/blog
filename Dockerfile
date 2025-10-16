# Dockerfile
FROM ghost:5-alpine

# 작업 디렉토리: /var/lib/ghost
WORKDIR /var/lib/ghost

# Cloudinary 스토리지 어댑터 설치
RUN npm install ghost-storage-cloudinary

# 우리의 설정 파일 복사
COPY config.production.json /var/lib/ghost/config.production.json

# 포트 노출
EXPOSE 2368

# Ghost 시작 (이미지 기본 CMD 사용)
