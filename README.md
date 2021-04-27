# Naver Search API

## 개요

Vue.js, Node.js를 이용해 사용자로부터 입력을 받고 네이버 검색 API로 부터 받은 데이터를 도표화하여 보여주는 웹 페이지

웹 페이지 주소 - [http://s3-meantint.s3-website.ap-northeast-2.amazonaws.com/](http://s3-meantint.s3-website.ap-northeast-2.amazonaws.com/)

## 사이트

데이터랩(검색어 트렌드) 사용 - [https://developers.naver.com/docs/serviceapi/datalab/search/search.md#%ED%86%B5%ED%95%A9-%EA%B2%80%EC%83%89%EC%96%B4-%ED%8A%B8%EB%A0%8C%EB%93%9C](https://developers.naver.com/docs/serviceapi/datalab/search/search.md#%ED%86%B5%ED%95%A9-%EA%B2%80%EC%83%89%EC%96%B4-%ED%8A%B8%EB%A0%8C%EB%93%9C)

## 구현 기능

- Vue.js와 Node.js를 활용한 동적 웹 페이지 구현

- vue-chartjs를 활용해 데이터를 시각적으로 표현

- 백엔드에서 네이버 Open API와 통신 및 저장

- AWS S3에 프론트엔드 배포, AWS EC2로 백엔드 서버 구동

## 프로젝트 배포 이슈

### Backend

Frontend와 Backend 작업을 모두 마치고 Github 호스팅을 하려고 시도하였다.

Backend를 실행시킬 서버를 찾다가 두 가지의 대안이 나왔는데

1. 개인 노트북을 서버로 사용한다.

2. Amazon EC2를 사용한다.

개인 노트북은 매일 사용하기 때문에 서버로 사용하기가 불가능 했고, 이미 인스턴스가 구축돼있는 Amazon EC2 사용을 결정하였다. 여기서 또 다른 문제가 하나 생겼는데 Backend를 Amazon EC2에 올리는 것에는 성공하였으나 ssh로 접근한 프로그램(MobaXterm 사용)을 닫으면 실행되던 Backend 프로그램도 중단되었다.

위의 문제를 해결하기 위해 Node.js의 PM2(Project Manager 2)를 사용하여 처리하였다.

- [https://engineering.linecorp.com/ko/blog/pm2-nodejs/](https://engineering.linecorp.com/ko/blog/pm2-nodejs/)

### Frontend

호스팅을 위해 Frontend를 Github에 올리려고 시도하였으나 node_module의 용량이 너무 커서 실패했다(node_module이 올라갔더라도 됐을지 장담은 못했다).

위의 문제를 해결하기 위해 호스팅할 정적 파일들을 폴더를 둬 따로 관리하기로 하였다.

- [https://paulcalla.tistory.com/385](https://paulcalla.tistory.com/385)

정적 파일을 Github에 올린 후 호스팅을 했더니 Frontend 부분이 실행되었다. 하지만 다음과 같은 에러가 떴다.

<p align="center">
	<img src="https://user-images.githubusercontent.com/50372451/115593662-c206e200-a30f-11eb-93a1-67fd37c7d082.png">
</p>

`ERR_SSL_PROTOCOL_ERROR` 에러가 발생한 이유는 Github에서 https로 Backend에 전달하는데 호스트가 표준 HTTP 요청으로 수신하고 있기 때문이다. Github의 경우 http로 접속 시도를 해도 강제로 https로 전달(Redirect)된다고 한다.

- [https://stackoverflow.com/questions/25277457/google-chrome-redirecting-localhost-to-https](https://stackoverflow.com/questions/25277457/google-chrome-redirecting-localhost-to-https)

- [https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security](https://en.wikipedia.org/wiki/HTTP_Strict_Transport_Security)

이러한 이유로 `Mixed Content`가 발생하게 된다.

- [https://dololak.tistory.com/611](https://dololak.tistory.com/611)

위의 문제를 해결하기 위해 해결 방안을 모색하였고 다음과 같은 방법을 내었다.

1. Backend를 http가 아닌 https로 요청받는 서버로 옮긴다.

2. Frontend를 http를 쓸 수 있는 곳(Github가 아닌)으로 옮긴다.

3. Amazon EC2를 https로 접근할 수 있는 방법을 찾는다.

### 이슈 해결

3번의 방법을 가장 먼저 시도하였으나(SSL 인증서 발급 및 ec2 주소를 https로 redirection 하기) nginx로 redirection까지 했음에도 통신이 되지 않았다.

결국 Github 호스팅을 하지 못하고 프론트엔드를 AWS S3로 옮겨서 배포를 하게 되었다.

AWS S3의 경우 http 주소를 사용했기 때문에 ec2(백엔드)와의 통신이 원활하였다.
