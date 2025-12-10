# Ghost 블로그 사용법 (Local + Vercel)

나만의 Ghost 블로그에 오신 것을 환영합니다!
이 프로젝트는 **내 컴퓨터(Mac)**에서 글을 쓰고, **Vercel**을 통해 전 세계에 무료로 배포하도록 설정되어 있습니다.

- **🌐 라이브 주소**: [https://pm-minji.com](https://pm-minji.com)

## 📚 1인 스타트업 운영 매뉴얼 (필독!)
이 블로그를 '하나의 프로덕트'로 키우기 위한 직군별 가이드라인입니다.
- **[👉 PRODUCT_MANUAL.md (운영 매뉴얼)](./PRODUCT_MANUAL.md)**: PM, 디자이너, 개발자로서 해야 할 일.
- **[👉 DATA_PIPELINE.md (데이터 분석)](./DATA_PIPELINE.md)**: GTM, GA4, BigQuery를 활용한 데이터 파이프라인 구축법.

---

## 🚀 빠른 시작 (Quick Start)

### 1. 글쓰기 모드 (Local)
글을 쓰거나 디자인을 고치고 싶을 때, 터미널에서 아래 명령어를 입력하세요:
```bash
ghost start
```
- **내 블로그 보기**: http://localhost:2368
- **관리자 페이지(글쓰기)**: http://localhost:2368/ghost
  - 처음 접속하면 회원가입(계정 생성)을 해야 합니다. 이건 내 컴퓨터에만 저장되는 계정이니 편하게 만드세요.

### 2. 세상에 발행하기 (Deploy)
글을 다 썼나요? 이제 인터넷에 올릴 차례입니다.
```bash
npm run deploy
```
이 명령어가 내 블로그를 HTML 파일로 변환해줍니다. 그 다음, GitHub로 보내면 Vercel이 알아서 배포합니다:
```bash
git add .
git commit -m "새로운 글 발행"
git push
```
*(GitHub에 Push하면 Vercel이 자동으로 감지하고 pm-minji.com에 반영합니다)*

## 🎨 꾸미기 (Design & Portfolio)
이미 **포트폴리오용 테마(Solo)**와 **매거진 테마(Edition)**를 설치해 두었습니다!
- **테마 적용**: 관리자 페이지 -> `Settings` -> `Design` -> `Change theme` -> **Solo** 옆의 `Activate` 클릭.
- **메뉴 설정**: 관리자 페이지 -> `Settings` -> `Navigation` (여기서 'Portfolio' 같은 메뉴를 추가하세요).
- **디테일 수정**: `Code Injection` 메뉴에서 CSS로 폰트나 여백을 조절할 수 있습니다.

## 📂 폴더 구조 설명 (알아두면 좋아요!)
- **`content/`**: **가장 중요한 보물창고**.
  - `content/images`: 글에 들어간 사진들이 여기 저장됩니다.
  - `content/themes`: 블로그 테마(디자인)가 여기 있습니다.
- **`dist/`**: 배포용 파일들이 모이는 곳입니다. (자동 생성됨)
- **`config.development.json`**: 블로그 설정 파일입니다.

## 🛠 유지보수 및 꿀팁
- **서버 끄기**: `ghost stop`
- **Ghost 업데이트**: `ghost update` (새로운 기능이 나오면 터미널에서 실행해주세요)
