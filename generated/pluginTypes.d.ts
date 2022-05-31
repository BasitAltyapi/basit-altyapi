export class config {
  ["mongooseDatabase"]: { connectionURL: string, compressors: ('none'| 'snappy' | 'zlib')[] };
}

export class Types {
  ["mongooseDatabase"]: { connection: import("mongoose").Connection, connect: import("mongoose").connect, addModel: (name: string, schema: import("mongoose").Schema, collection?: string, options?: import("mongoose").CompileModelOptions)=>any, getModel: (name: string) => import("mongoose").Model, Schema: import("mongoose").Schema };
};
export type TEventNames = "mongooseDatabase:onConnect";
export type TEvents = mongooseDatabase_onConnect;
export interface mongooseDatabase_onConnect { eventName: "mongooseDatabase:onConnect", onEvent: (arg0: boolean) => void }