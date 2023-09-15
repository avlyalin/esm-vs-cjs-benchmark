const { performance, PerformanceObserver } = require('node:perf_hooks');

module.exports = {
  wrap: function(fn) {
    const wrapped = performance.timerify(fn);

    const obs = new PerformanceObserver((list) => {
      console.log(list.getEntries()[0].duration);

      performance.clearMarks();
      performance.clearMeasures();
      obs.disconnect();
    });

    obs.observe({ entryTypes: ['function'] });

    wrapped();

    return wrapped;
  }
}
