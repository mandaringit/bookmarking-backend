# Bookmarking (Backend)

그때 그때 기록하자. 북마킹 백엔드

## 기술스택

- Typescript
- Express
- Passport.js (Local)
- TypeORM

### AWS RDS 연동

1. ormconfig.js 설정.
2. RDS 인스턴스 생성 및 퍼블릭 액세스 설정
3. 연결 확인 -> `mysql -u <USERNAME> --host <HOSTNAME> -P <PORT> -p`
