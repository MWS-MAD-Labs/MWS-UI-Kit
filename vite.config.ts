import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      entryRoot: "src",
      include: [
        "src/index.ts",
        "src/vite-env.d.ts",
        "src/tokens.ts",
        "src/components/AppShell.tsx",
        "src/components/Button.ts",
        "src/components/CommandPalette.tsx",
        "src/components/DataTable.tsx",
        "src/components/FormWizard.tsx",
        "src/components/Input.ts",
        "src/components/Modal.ts",
        "src/components/UIPrimitives.tsx",
        "src/components/classNames.ts",
      ],
      insertTypesEntry: true,
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  build: {
    lib: {
      entry: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
      name: "MwsUiKit",
      fileName: "mws-ui-kit",
      formats: ["es", "umd"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-dom/client", "react/jsx-runtime"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-dom/client": "ReactDOMClient",
          "react/jsx-runtime": "ReactJSXRuntime",
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts",
  },
});
