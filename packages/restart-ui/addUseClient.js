// addUseClient.js
import fs from 'fs'
import path from 'path'

const addUseClientDirective = (dir) => {
	const files = fs.readdirSync(dir)

	files.forEach((file) => {
		const filePath = path.join(dir, file)
		if (fs.statSync(filePath).isDirectory()) {
			addUseClientDirective(filePath)
		} else if (file.endsWith('.js')) {
			const content = fs.readFileSync(filePath, 'utf8')
			if (!content.startsWith("'use client';")) {
				const updatedContent = `'use client';\n${content}`
				fs.writeFileSync(filePath, updatedContent, 'utf8')
			}
		}
	})
}

// ESM 출력 디렉토리에 적용
addUseClientDirective('./dist/esm')
