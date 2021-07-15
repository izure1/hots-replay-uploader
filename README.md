# hots-replay-uploader

## 의존 프로그램 설치
[Node.js](https://nodejs.org/en/)와 `npm`을 설치하여 주십시오.  
npm은 node.js를 설치하면 보통 함께 설치됩니다.

## 의존 모듈 설치
소스 코드를 다운로드 받은 후, 프로젝트 폴더에서 아래 명령어를 실행합니다.
```
npm i
```
## 의존 모듈 오류 수정
설치가 끝났다면 일부 모듈의 오류를 고쳐야 합니다.  
`hots-parser` 의존 모듈에 문제가 있습니다.

`node_modules/hots-parser/index.js` 파일을 열고
```
const ReplayTypes = require(path.join(__dirname, 'constants.js')); // <-- 이 부분
const heroprotocol = require('heroprotocol');
const XRegExp = require('xregexp'); // <-- 이 부분
```
위 부분을 아래로 수정하십시오.
```
const ReplayTypes = require('./constants.js'); // <-- 이 부분
const heroprotocol = require('heroprotocol');
const XRegExp = require('xregexp').default; // <-- 이 부분
```

## 빌드하기
오류 수정이 끝났다면 빌드를 시작합니다.  
프로젝트 폴더에서 아래 명령어를 실행합니다.
```
npm run electron:build
```