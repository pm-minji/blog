FROM ghost:latest
ENV NODE_ENV=production

# Supabase(S3 호환) 스토리지 어댑터
RUN npm install ghost-storage-adapter-s3

# Ghost 설정 복사
COPY ./config.production.json /var/lib/ghost/config.production.json

EXPOSE 2368
CMD ["ghost", "run"]
