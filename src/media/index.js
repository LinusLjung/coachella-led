const context = require.context('./', false);

export default context.keys().filter(key => ['./', './index', './index.js'].indexOf(key) === -1).map(key => context(key));
