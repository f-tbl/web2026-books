import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("Falta la variable de entorno MONGODB_URI");

export const client = new MongoClient(uri);
// Better Auth reutiliza esta misma db para users y sessions.
export const db = client.db();
