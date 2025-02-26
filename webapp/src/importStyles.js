// importStyles.js
const importAll = (r) => r.keys().forEach(r);
importAll(require.context('./styles', false, /\.css$/));