

module.exports = new Underline.Plugin({
  name: "Database",
  namespace: "mongooseDatabase",
  version: "v0.0.1",
  requires: {
    modules: {
      "mongoose": "6.2.6",
    }
  },
  implements: {
    events: {
      onConnect: "boolean",
    },
    properties: {
      connection: "import(\"mongoose\").Connection",
      connect: "import(\"mongoose\").connect",
      addModel: "(name: string, schema: import(\"mongoose\").Schema, collection?: string, options?: import(\"mongoose\").CompileModelOptions)=>any",
      getModel: "(name: string) => import(\"mongoose\").Model",
      Schema: "import(\"mongoose\").Schema",
    }
  },
  onLoad(api) {
    let { connect, Schema, model, connection } = require("mongoose");

    let models = {};

    api.define("addModel", (name, schema, collection, options) => {
      models[name] = model(name, schema, collection, options);
    })
    api.define("getModel", (name) => models[name]);
    
    api.define("connection", connection);
    api.define("connect", (uri,options,cb) => {
      connect(uri,options,cb).then(() => {
        api.emit("onConnect", true);
      }).catch(() => {
        api.emit("onConnect", false);
      })
    });
    api.define("Schema", Schema);

    
    api.setPluginReady();
  }
})