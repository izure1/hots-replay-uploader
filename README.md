# hots-replay-uploader
---
## 설명
히오스 리플레이를 자동으로 분석해 특정 서버로 업로드하는 프로그램입니다.  
사용자 클라이언트에서 분석한 후 업로드하는 방식이므로 서버에 부담이 적습니다.

빠른대전, 폭풍리그를 포함해 모든 리플레이를 업로드할 수 있지만,  
히오스크를 계기로 만들어졌으므로 현재는 사용자지정 게임의 리플레이만 구문 분석하고 업로드합니다.

### 사용 방법
1. 프로그램을 설치합니다.
1. 프로그램을 실행합니다.
1. 프로그램을 끄지 않고 히오스를 플레이합니다.  
이후, 매 게임이 끝날 때 마다 생성된 리플레이를 자동 감지하여 분석 후 업로드합니다.

## 다운로드
[릴리스 페이지](https://github.com/izure1/hots-replay-uploader/releases)에서 확인할 수 있습니다.  
추후에 자동 업데이트 기능을 지원할 예정입니다.
## 사양
`Windows10-x64`에서 개발되었고, 빌드되었습니다.  
`Windows7+` 이상에서도 작동할 수 있지만, 확실한 작동을 보장하지 못합니다.  

오류가 있다면 신고 및 기여해주세요.  

## 직접 빌드하기
원한다면 위 소스코드를 이용하여 직접 컴퓨터에서 빌드할 수 있습니다.
### 의존 프로그램 설치
[Node.js](https://nodejs.org/en/)와 `npm`을 설치하여 주십시오.  
npm은 node.js를 설치하면 보통 함께 설치됩니다.

### 의존 모듈 설치
소스 코드를 다운로드 받은 후, 프로젝트 폴더에서 아래 명령어를 실행합니다.
```
npm i
```
### 의존 모듈 오류 수정
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

### 빌드하기
오류 수정이 끝났다면 빌드를 시작합니다.  
프로젝트 폴더에서 아래 명령어를 실행합니다.
```
npm run electron:build
```