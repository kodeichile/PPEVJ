import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("../outputs", import.meta.url)));
const preferredPort = Number(process.env.PORT || 8081);
const host = process.env.HOST || "127.0.0.1";

const types = new Map([
  [".html", "text/html; charset=utf-8"],
  [".css", "text/css; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".gif", "image/gif"],
  [".svg", "image/svg+xml; charset=utf-8"],
  [".webp", "image/webp"]
]);

function resolveRequestPath(url, port) {
  const parsed = new URL(url, `http://${host}:${port}`);
  const cleanPath = decodeURIComponent(parsed.pathname === "/" ? "/index.html" : parsed.pathname);
  const filePath = normalize(join(root, cleanPath));

  if (!filePath.startsWith(root)) return null;
  return filePath;
}

function listen(port, attempts = 0) {
  const server = createServer((request, response) => {
    const filePath = resolveRequestPath(request.url || "/", port);

    if (!filePath || !existsSync(filePath) || !statSync(filePath).isFile()) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Archivo no encontrado");
      return;
    }

    response.writeHead(200, {
      "Content-Type": types.get(extname(filePath).toLowerCase()) || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    createReadStream(filePath).pipe(response);
  });

  server.once("error", (error) => {
    if (error.code === "EADDRINUSE" && attempts < 10 && !process.env.PORT) {
      server.close();
      listen(port + 1, attempts + 1);
      return;
    }

    throw error;
  });

  server.listen(port, host, () => {
    console.log(`Sirviendo outputs en http://${host}:${port}/`);
  });
}

listen(preferredPort);
