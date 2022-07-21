import { IOther } from "../types/Event";

export class config {

}

export class Types {
  ["mongooseDatabase"]: import("../plugins/mongoose.up/index").Plugin;
  ["vault"]: import("../plugins/vault.up/index").Plugin;
};
export type TEventNames = "mongooseDatabase:onConnect";
export type TEvents = mongooseDatabase_onConnect;
export interface mongooseDatabase_onConnect { eventName: "mongooseDatabase:onConnect", onEvent: (arg0: boolean, other: IOther) => void }