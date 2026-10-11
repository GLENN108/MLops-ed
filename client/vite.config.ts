import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        port: 5173,
        host: true,
    },
    resolve: {
        alias: {
            "@": resolve(projectRoot, "./"),
        },
    },
});
