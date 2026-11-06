// create a cached connection so that you prevent creating
// multiple connections during development when next.js hot reloads code
import { MongoClient } from "mongodb";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
    // reuse promise stored on global so that hot reloads dont create
    // new client every time
    if (!global._mongoClientPromise) {
        const client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect(); // keep it on global
    }
    clientPromise = global._mongoClientPromise;
} else {
    // modules only load once in production so normal module level client is fine
    const client = new MongoClient(uri, options);
    clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;


