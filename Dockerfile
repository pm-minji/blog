FROM ghost:latest
ENV NODE_ENV=production
# Cloudinary 스토리지 어댑터 설치
RUN npm install ghost-storage-cloudinary
# 설정 파일 복사
COPY ./config.production.json /var/lib/ghost/config.production.json
EXPOSE 2368
CMD ["ghost", "run"]
