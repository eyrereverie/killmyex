import { createStaticServer, listen } from './static-server.mjs';

const port = Number.parseInt(process.env.PORT ?? '8000', 10);
const host = process.env.HOST ?? '127.0.0.1';
const server = createStaticServer({ port });

await listen(server, { host, port });

console.log(`Kill My Ex dev server running at http://${host}:${port}/`);
