import { defineConfig } from 'vite';

// Inline the small CSS bundle so first paint does not wait on a stylesheet request.
function inlineCss() {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      for (const file of Object.values(bundle)) {
        if (file.type !== 'asset' || !file.fileName.endsWith('.html')) continue;
        file.source = String(file.source).replace(/<link rel="stylesheet"(?: crossorigin)? href="\/(assets\/[^"]+\.css)">/g, (m, name) =>
          bundle[name] ? `<style>${bundle[name].source}</style>` : m);
      }
    },
  };
}

export default defineConfig({ plugins: [inlineCss()] });
