# Monorepo for react-bootstrap

bootstrap을 내가 생각하는 문법으로 다시 만들어 보다가 react-bootstrap도 다시만들어 봤다.
현재는 `Nextra`를 이용한 문서화 작업을 하는 중이다.

## 발견된 문제점

### `remark-emoji` 사용

mdx에서 emoji를 사용하기 위해 `remark-emoji`를 `next.config.ts`에 반영했으나  
`ERR_PACKAGE_PATH_NOT_EXPORTED` 에러가 발생!
원인은 ts는 컴파일 후 commonjs 방식으로 작동하는데 `remark-emoji`는 ESM방식만 지원하여 문제가 생겼다.
`next.config.(mjs|mts)`는 정상 적으로 동작한다. 다만 `mts` 확장자는 "experimental"이라 사용시 주의가 필요하다.
