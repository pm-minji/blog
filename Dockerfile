FROM ghost:latest
ENV NODE_ENV=production
# Ghost가 쓰는 기본 포트
EXPOSE 2368
# 컨테이너가 실행될 때 Ghost를 켭니다
CMD ["ghost", "run"]
