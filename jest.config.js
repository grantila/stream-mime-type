export default {
	resolver: "ts-jest-resolver",
	testEnvironment: 'node',
	testMatch: [ '<rootDir>/lib/*.spec.ts' ],
	collectCoverageFrom: [ '<rootDir>/lib/**/*.ts' ],
	collectCoverage: true,
	coveragePathIgnorePatterns: [ '/node_modules/' ],
	coverageReporters: [ 'lcov', 'text', 'html' ],
	extensionsToTreatAsEsm: ['.ts'],
};
