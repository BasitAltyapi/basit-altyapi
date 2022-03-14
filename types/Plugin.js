class Plugin {
  _type = "plugin";
  constructor(obj = {}) {

    if (!obj.name) {
      console.error("[HATA] Plugin dosyasında isim alanı boş bırakılamaz!");
      process.exit(-1);
    }
    this.name = obj.name;
    this.version = (obj.version || "0.0.1").replace("v", "");
    if (!obj.namespace) {
      console.error("[HATA] Plugin dosyasında namespace alanı boş bırakılamaz!");
      process.exit(-1);
    }
    this.namespace = obj.namespace;
    this.requires = obj.requires;
    if (obj.requires?.modules) {
      let names = Object.keys(obj.requires.modules);
      for (let i = 0; i < names.length; i++) {
        const moduleName = names[i];
        try {
          require(moduleName)
        } catch (e) {
          console.error(`[HATA] "${obj.name}" adlı plugin, "${moduleName}" (${obj.requires.modules[moduleName]}) adlı modülü istiyor!`);
          process.exit(-1);
        }
      }
    }

    this.implements = obj.implements;
    this.onLoad = obj.onLoad;
  }
}



module.exports = Plugin;