# 환경변수 설정

앱을 실행하기 전에 `.env.example`을 복사해 로컬 `.env` 파일을 만드세요.

```sh
cp .env.example .env
```

Expo 앱에서 클라이언트에 노출되는 환경변수는 반드시 `EXPO_PUBLIC_` 접두사를 사용해야 합니다.

## 변수 목록

- `EXPO_PUBLIC_API_BASE_URL`: 백엔드 API 주소입니다. 생략하면 운영 Vercel URL을 기본값으로 사용합니다.
- `EXPO_PUBLIC_TMDB_API_KEY`: 영화 검색과 상세 화면에서 사용하는 TMDB API 키입니다.
- `EXPO_PUBLIC_FIREBASE_API_KEY`: Firebase 웹 API 키입니다.
- `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`: Firebase 인증 도메인입니다.
- `EXPO_PUBLIC_FIREBASE_PROJECT_ID`: Firebase 프로젝트 ID입니다.
- `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`: Firebase 스토리지 버킷입니다.
- `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`: Firebase 메시징 발신자 ID입니다.
- `EXPO_PUBLIC_FIREBASE_APP_ID`: Firebase 앱 ID입니다.

이 값들은 모바일 클라이언트 번들에 포함됩니다. 서버에서만 사용해야 하는 비밀 키는 `EXPO_PUBLIC_` 환경변수에 넣지 마세요.
