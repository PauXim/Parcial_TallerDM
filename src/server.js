const http = require("http");
const fs = require("fs/promises");
const path = require("path");

const PORT = 3000;

// IMPORTANTE: Si tu HTML/CSS están en la raíz, usamos '..' para salir de 'src'
// Si decides meterlos en una carpeta llamada 'public', cambia el final a '..', 'public'
const PUBLIC_PATH = path.join(__dirname, ".."); 

const MIME_TYPES = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".json": "application/json",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".svg": "image/svg+xml"
};

const server = http.createServer(async (req, res) => {
    // 1. Imprimir peticiones para que veas qué carga en la terminal
    console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);

    // 2. Espacio para Rutas API (Por si el profe pide lógica después)
    // if (req.url.startsWith('/api')) { ... return; }

    // 3. Manejo de Archivos Estáticos (HTML, CSS, IMG)
    try {
        const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
        let pathname = parsedUrl.pathname === "/" ? "/index.html" : parsedUrl.pathname;
        
        const ext = path.extname(pathname);
        const fullPath = path.join(PUBLIC_PATH, pathname);
        
        // Determinar el tipo de contenido
        const contentType = MIME_TYPES[ext] || "text/plain";
        
        // Leer el archivo de forma asíncrona (más rápido)
        const content = await fs.readFile(fullPath);

        res.writeHead(200, { "Content-Type": contentType });
        res.end(content);

    } catch (err) {
        // Manejo de errores (404 si no existe, 500 si es otra cosa)
        const isNotFound = err.code === "ENOENT";
        const statusCode = isNotFound ? 404 : 500;
        const msg = isNotFound ? "404 - Archivo no encontrado" : "500 - Error Interno";

        console.error(`❌ Error en ${req.url}: ${err.message}`);
        
        res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
        res.end(msg);
    }
});

server.listen(PORT, () => {
    console.log(`-----------------------------------------------`);
    console.log(`🚀 SERVIDOR MULTIMEDIA LISTO`);
    console.log(`🔗 URL: http://localhost:${PORT}`);
    console.log(`📂 RAIZ: ${PUBLIC_PATH}`);
    console.log(`-----------------------------------------------`);
});