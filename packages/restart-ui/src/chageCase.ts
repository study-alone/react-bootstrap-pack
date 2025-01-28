const toKebabCase = (str: string) => {
	if (typeof str !== 'string') {
		return ''
	}

	return (
		str
			// 대문자 앞에 공백 추가 (단, 문자열 시작은 제외)
			.replace(/([A-Z])/g, ' $1')
			// 연속된 특수문자나 공백을 하나의 공백으로 통일
			.replace(/[-_\s]+/g, ' ')
			// 앞뒤 공백 제거하고 소문자로 변환
			.trim()
			.toLowerCase()
			// 공백을 하이픈으로 변환
			.replace(/\s+/g, '-')
			// 시작이 하이픈인 경우 제거
			.replace(/^-+/, '')
	)
}

const toCamelCase = (str: string) => {
	if (typeof str !== 'string') {
		return ''
	}

	// 1. 먼저 모든 특수문자(-, _, 공백 등)를 공백으로 통일
	const normalized = str.replace(/[-_\s]+/g, ' ')

	// 2. 첫 단어는 소문자로, 그 이후 단어들은 첫 글자만 대문자로 변환
	return normalized
		.split(' ')
		.map((word, index) => {
			// 빈 문자열이면 건너뛰기
			if (!word) return ''

			// 모두 소문자로 변환
			word = word.toLowerCase()

			// 첫 번째 단어가 아니면 첫 글자를 대문자로
			if (index !== 0) {
				word = word.charAt(0).toUpperCase() + word.slice(1)
			}

			return word
		})
		.join('')
}

type Cases = 'kebab' | 'camel'

export const changeCase = (caseType: Cases, str: string) => {
	const dict: { [key in Cases]: (str: string) => string } = {
		kebab: toKebabCase,
		camel: toCamelCase,
	}

	return dict[caseType](str)
}
