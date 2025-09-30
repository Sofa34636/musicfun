import createClient, {type Middleware} from "openapi-fetch";
import type {paths} from "./schema.ts";

export const client = createClient<paths>({ baseUrl: "https://musicfun.it-incubator.app/api/1.0/" });

const myMiddleware: Middleware = {
    async onRequest({ request }) {
        request.headers.set('API-KEY', '96073eef-87a0-4cd6-b4e1-a91ee7d115d6');
        return request;
    }
};


client.use( myMiddleware )