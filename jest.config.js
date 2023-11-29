module.exports = {
  roots: ["<rootDir>/src/__tests__"],
  collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  transform: {
    ".+\\.ts$": "ts-jest",
  },
  moduleNameMapper: {
    "@/(.*)": "<rootDir>/src/$1",
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$"
}
