const stuffs = require('stuffs');
class Locale {
  _type = "locale";
  locale = "tr";
  _data = {};
  data = {};

  /** @param {{locale:string,data:object}} obj */
  constructor (obj={}) {
    this.locale = obj.locale?.split("-")[0] ?? this.locale;
    this._data = obj.data ?? this._data;
    this.data = convert(this._data);
  }
}

function convert(data) {
  return Object.fromEntries(Object.entries(data).map(([key, value]) => {
    if (typeof value === "string") {
      return [key, (...args) => {
        return stuffs.mapReplace(value, Object.fromEntries(args.map((t, i) => [`{${i}}`, t])))
      }]
    } else {
      return [key, convert(value)];
    }
  }))
}

module.exports = Locale;
