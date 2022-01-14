class Locale {
  private _type: string;
  locale: LocaleString;
  private _data: object;
  data: Data;
  constructor(obj: TLocaleConstructor);
}

export type LocaleString = "en" | "bg" | "zh" | "hr" | "cs" | "da" | "nl" | "fi" | "fr" | "de" | "el" | "hi" | "hu" | "it" | "ja" | "ko" | "no" | "pl" | "pt" | "ro" | "ru" | "es" | "sv" | "th" | "tr" | "uk" | "vi";

type TLocaleConstructor = Omit<Locale, "_data" | "_type" | "data"> & { data: object };

export interface Data {
  [key: string]: (...args: any[]) => string;
}

export = Locale;