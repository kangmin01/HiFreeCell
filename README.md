# HiFreeCell
### ♠️♥️ FreeCell Web Game  ♣️♦️

- [HiFreecell→](https://hi-freecell.fly.dev/)
- [후기→](https://velog.io/@kangmin01/HiFreecell-%EC%A0%9C%EC%9E%91-%ED%9B%84%EA%B8%B0)
- 제작 기간 : 2023.09.05 ~ 2023.10.31


## 🔸개요
52장의 카드를 사용해 모든 카드를 색상이 교차되는 순서대로 정렬하고, 에이스부터 킹까지 무늬별로 홈셀에 쌓아 올리는 단일 플레이어 카드 게임입니다. 현대의 프리셀 게임들은 사용자 편의를 위해 카드가 프리셀을 통해 임시로 이동하고 다시 줄 스택으로 옮겨지는 과정을 간소화하여, 한 번에 여러 장의 카드를 옮길 수 있는 기능을 제공합니다. 하지만 하이프리셀은 카드를 한 번에 한 장씩만 옮길 수 있습니다.

## 🔸기술 스택
|기능|기술 스택|
|--|--|
|언어|JavaScript|
|백엔드|Express|
|데이터베이스| MongoDB|
|템플릿 엔진|Pug|
|CSS 전처리기| SCSS|
|클라우드 서비스| AWS|
|배포| Fly.io|

## 🔸기능

### 프리셀 플레이
[깃허브 코드 →](https://github.com/kangmin01/HiFreeCell/blob/main/src/client/js/gamePlay.js)

카드를 이동시킬 때 조건에 맞지 않는다면 카드는 원래의 자리로 돌아갑니다. 홈셀은 굳이 같은 무늬 바로 위에 올려놓지 않아도 홈셀 영역 위에만 있다면 해당 무늬 위로 알아서 자리를 찾아가도록 만들었습니다. 홈셀에 에이스부터 킹까지 다 쌓으면 승리하게 되고 프리셀을 다 사용했는데 움직일 카드가 없다면 패배하게 됩니다. 그래도 바로 패배로 기록되는 것이 아니라 마지막 수를 취소하거나 재도전할 수 있습니다. 게임을 끝내면 플레이 시간이 저장되고 해당 게임의 최단 기록을 보여줍니다. 게임 도중 창을 끄거나 새 게임을 플레이하는 경우 패배로 기록됩니다.

- 승리시
![하이-승리-배속-Clipchamp로-제작](https://github.com/kangmin01/HiFreeCell/assets/57487175/3d0d3bc5-055a-46b3-81d1-28435eb96ae3)

- 패배시 (마지막수 취소)
![하이-패배-Clipchamp로-제작](https://github.com/kangmin01/HiFreeCell/assets/57487175/9c72f082-ca3f-4b1c-9bcc-1af52dac6ab3)

- 패배시 (마지막수 취소X)
![제목-없는-동영상-Clipchamp로-제작-_2_](https://github.com/kangmin01/HiFreeCell/assets/57487175/a5f35d93-f3e0-489c-9d9e-6579c2e5fe90)

### 회원가입 및 로그인
- 기본 이메일과 비밀번호를 이용한 회원가입 및 로그인
![하이-로그인1-Clipchamp로-제작](https://github.com/kangmin01/HiFreeCell/assets/57487175/66c8a9bd-3121-4268-a7a3-c52e192bac9e)

- 소셜 로그인 기능 지원 (구글, 카카오)
![제목-없는-동영상-Clipchamp로-제작-_1_](https://github.com/kangmin01/HiFreeCell/assets/57487175/d36d4643-4f8b-4a64-b5b4-2bc8dba12a4d)

### 관리자 기능
- 게임의 승률과 최고 기록 통계 확인
- 새로운 게임의 생성 및 기존 게임 삭제

### 게임 페이지
- 사용자별 게임 승률, 현재 플레이 중인 게임의 상태 정보 확인 가능
![](https://velog.velcdn.com/images/kangmin01/post/71bf3db8-ff09-42d8-a77d-8e67abae6679/image.png)

### 마이 페이지
- 사용자가 플레이한 게임의 통계 및 정보 확인
- 회원 정보 수정
![제목-없는-동영상-Clipchamp로-제작-_3_](https://github.com/kangmin01/HiFreeCell/assets/57487175/151b56cc-fa73-41a6-acc6-b78658550342)

- 비밀번호 변경
