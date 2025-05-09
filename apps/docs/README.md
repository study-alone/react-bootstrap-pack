# Monorepo for react-bootstrap

bootstrap을 내가 생각하는 문법으로 다시 만들어 보다가 react-bootstrap도 다시만들어 봤다.
현재는 `Nextra`를 이용한 문서화 작업을 하는 중이다.

## 발견된 문제점

### `remark-emoji` 사용

mdx에서 emoji를 사용하기 위해 `remark-emoji`를 `next.config.ts`에 반영했으나  
`ERR_PACKAGE_PATH_NOT_EXPORTED` 에러가 발생!
원인은 ts는 컴파일 후 commonjs 방식으로 작동하는데 `remark-emoji`는 ESM방식만 지원하여 문제가 생겼다.
`next.config.(mjs|mts)`는 정상 적으로 동작한다. 다만 `mts` 확장자는 "experimental"이라 사용시 주의가 필요하다.
결국 비교적 안정적인 `mjs`를 선택했다.

### codeblock customize

> **costomize의 목적, 목표**
>
> - live code preview 사용
> - custom prop 추가

mdx파일을 컴파일 할 때 `codeblock`은 mdx-components의 `<Pre />` 컴포넌트를 사용합니다.  
이 경우 **live code preview**를 사용하고 싶다면 customize가 필요한데 `nextra > mdxOptions > rehypePlugins, remarkPlugins`의 설정 순서가 항상 기본 설정 보다 밀리기 때문에 목표한 customize가 불가능하다고 판단하여 `pnpm patch`를 이용하여 package를 `patch-package`를 사용한 것처럼 수정하는 전략을 선택했습니다.

### pnpm patch (like patch-package)

예시에서는 `lodash`를 대상으로 간주합니다.

#### 1. patch 할 pzckage 선택 및 편집 시작

```sh
pnpm patch lodash
```

실행 하면 임시 폴더가 생성 됩니다.  
ex: `node_modules/.pnpm_patches/lodash@1.0.0`
여기서 코드를 수정합니다.

#### 2. 수정한 내용 저장하고 patch 생성

```sh
Patch: You can now edit the package at:

  /Users/mkchun/project/test/pnpm-patch-test/node_modules/.pnpm_patches/lodash@4.17.21

To commit your changes, run:

  pnpm patch-commit '/Users/mkchun/project/test/pnpm-patch-test/node_modules/.pnpm_patches/lodash@4.17.21'
```

이 명령어를 실행하면 project root에 patches폴더가 생성되고, patch file이 저장됩니다.  
ex: `patches/lodash.patch`

#### 3. patch 적용 및 확인

- `pnpm install`을 실행할 때 패치가 자동 적용
- 적용되었는지 확인하려면 패치된 파일이 node_modules에 반영되었는지 확인

### 4. patch file 관리

- 패치 내용은 `patches/` 폴더 안에 `.patch`파일로 보관
- git에 커밋해서 다른 개발자와도 공유 가능
