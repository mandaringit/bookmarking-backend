# Bookmarking API

## Relation

- User : 사용자
  - reports (1 : N) : 사용자는 여러개의 리포트를 갖는다.
  - fragments (1 : N) : 사용자는 여러개의 생각조각을 갖는다.
- Author : 작가
  - books(1 : N) : 작가는 여러개의 책을 갖는다.
- Book : 책
  - author(N : 1) : 책은 하나의 작가를 갖는다.
- Report
  - fragments(1 : N) : 리포트는 여러개의 생각 조각을 갖는다.
  - user(N : 1) : 리포트는 하나의 유저를 갖는다.
  - book(N : 1) : 리포트는 하나의 책을 갖는다.
- Fragment : 하나의 리포트를 갖는 생각 조각.
  - book (N : 1): 생각 조각은 하나의 책을 갖는다.
  - user (N : 1): 생각 조각은 하나의 유저를 갖는다.

## Routes

### `/auth`

### `/authors`

### `/`
