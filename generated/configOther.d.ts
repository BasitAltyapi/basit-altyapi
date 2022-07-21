export default class Other {
  redis: {
    url: string;
    key: string
  };
  plugins: import('./pluginTypes').config
}