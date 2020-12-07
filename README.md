# Todo 백엔드

TypeORM을 활용해 간단한 TODO API를 만들어보았다. 사용자 인증같은 기능 없이 오직 Todo를 만들고, 지우고, 업데이트할 뿐이다.

## 할일

- [x] CREATE
- [x] READ
- [x] UPDATE
- [x] DELETE
- [ ] READ & Filter
- [ ] Dummy Data
- [ ] Deploy

## /todos

- GET `/todos` : 모든 Todo 가져옴
- GET `/todos/:todoId` : 해당하는 Todo 가져오기
- POST `/todos` : text를 body로 주면 Todo 생성
- DELETE `/todos/:todoId` : 해당하는 Todo 삭제
- PATCH `/todos/:todoId` : 해당하는 Todo body에 text 보내면 내용 수정
- PATCH `/todos/:todoId/toggle` : 해당하는 Todo 완료 여부 토글
