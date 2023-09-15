import performanceWrapper from './performance-wrapper.cjs';

const wrappedImport = performanceWrapper.wrap(() => import('./esm/level1/index.js'));

wrappedImport();
