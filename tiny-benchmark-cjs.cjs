const performanceWrapper = require('./performance-wrapper.cjs');

const wrappedRequire = performanceWrapper.wrap(() => require('./cjs/level1'))

wrappedRequire();
