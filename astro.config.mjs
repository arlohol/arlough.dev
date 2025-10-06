// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap"
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://arlough.dev",
  integrations: [
    preact(), 
    icon(), 
    sitemap({
      filter: (page) =>
        !page.includes("/blog/tags") &&
        !page.includes("/blog/techs"),
      }
    ),
  ],

  vite: {
    // @ts-ignore
    plugins: [tailwindcss()],
    build: {
      sourcemap: true
    }
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark'
    },
  },
});