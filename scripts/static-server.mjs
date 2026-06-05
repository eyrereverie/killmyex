import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const contentTypes = {
  '.css': 'text/css',
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
};

export function createStaticServer({ root = resolve('.'), port = 8000 } = {}) {
  const resolvedRoot = resolve(root);

  function localPathFor(url) {
    const pathname = new URL(url, `http://localhost:${port}`).pathname;
    const decoded = decodeURIComponent(pathname === '/' ? '/index.html' : pathname);
    const fullPath = normalize(join(resolvedRoot, decoded));

    if (!fullPath.startsWith(resolvedRoot)) {
      throw new Error('Blocked path traversal');
    }

    return fullPath;
  }

  return createServer(async (request, response) => {
    try {
      const filePath = localPathFor(request.url ?? '/');
      const body = await readFile(filePath);
      response.writeHead(200, {
        'Content-Type': contentTypes[extname(filePath)] ?? 'application/octet-stream',
      });
      response.end(body);
    } catch (error) {
      response.writeHead(error.message === 'Blocked path traversal' ? 403 : 404);
      response.end();
    }
  });
}

export async function listen(server, { host = '127.0.0.1', port = 8000 } = {}) {
  await new Promise((resolveListen) => {
    server.listen(port, host, resolveListen);
  });
}
