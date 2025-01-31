# Bootstrapy

react-bootstrap을 React 19에 맞춰 다시 만든 라이브러리입니다.

## 스타일 적용 시 범위를 지정하려고 할 때

```json
// package.json
...
"scripts": {
    "scope-styled": "postcss ./node_modules/@repo/bootstrapy/dist/bootstrap.css -o ./public/bootstrap-scoped.css"
}
...
```
