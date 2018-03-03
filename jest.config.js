module.exports = {
    verbose: true,
    timers: 'fake',
    roots: ['src'],
    testMatch: ['**/?(*_)(spec|test).js?(x)'],
    setupFiles: [
        './jestsetup.js',
    ],
    collectCoverage: false,
    collectCoverageFrom: ['components/*.jsx'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    },
    globals:{
        "__DEV__": true,
    },
    moduleNameMapper: {
        "^reducerActions$": "<rootDir>/src/reducerActions/index.js",
        "constants(.*)$": "<rootDir>/src/constants/$1",
        "components(.*)$": "<rootDir>/src/components/$1",
        "data(.*)$": "<rootDir>/src/data/$1",
        "utilities(.*)$": "<rootDir>/src/utilities/$1",
        "^config$":"<rootDir>/src/config.js",
        "\\.(css|scss)$": "identity-obj-proxy",
        "^.+\\.(gif|ttf|eot|svg|woff|woff2|ico)$": "<rootDir>/tools/fileMock.js"
      },
    notify: true,
    transformIgnorePatterns: ["node_modules/(?!react-native|native-base|react-navigation|react-native-fabric)"],
};