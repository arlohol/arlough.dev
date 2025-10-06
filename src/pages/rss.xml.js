import rss, { pagesGlobToRssItems } from '@astrojs/rss';

export async function GET(context) {
  return rss({
    title: 'Network Security and Automation Blog | Arlo Hollingshad',
    description: 'Welcome to my blog, where I share my passion for Network Security and Automation.',
    site: context.site,
    items: await pagesGlobToRssItems(import.meta.glob('./**/*.md')),
    customData: `<language>es</language>`,
  });
}