module.exports = {
	transform: {
		"^.+\\.tsx?$": "<rootDir>/node_modules/ts-jest/preprocessor.js",
	},
	testRegex: "(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js|jsx)$",
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
	moduleNameMapper: {
		"\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
		"\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js",
	},
}
