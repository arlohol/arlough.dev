import type { Post } from "../components/ui/Post.astro"

export function getPosts({ includeDrafts = false }: { includeDrafts?: boolean } = {}) {
  // 1️⃣ grab _all_ .md files under pages/blog/posts, including subfolders
  const modules = import.meta.glob<Post>(
    '../pages/blog/posts/**/*.md',
    { eager: true }
  );
  // 2️⃣ map into an array, extracting a nested path for each file
  const posts: (Post & { filename: string; url: string })[] = Object.entries(modules).map(
    ([fullPath, mod]) => {
      // fullPath might be: "../pages/blog/posts/ngfw-e/1-config.md"
      //  ▿ split into segments, find the "posts" index
      const parts = fullPath.split('/');
      const postsIndex = parts.findIndex((p) => p === 'posts');
      // everything after "posts/"
      const relSegments = parts.slice(postsIndex + 1);
      // join them back and strip the .md
      const relPath = relSegments.join('/').replace(/\.md$/, '');

      return {
        ...(mod as Post),
        filename: relSegments[relSegments.length - 1],
        url: `/blog/posts/${relPath}`,    // => "/blog/posts/ngfw-e/1-config"
      };
    }
  );

  // 3️⃣ filter out drafts if requested
  const published = includeDrafts
    ? posts
    : posts.filter((p) => !p.frontmatter.draft);

  // 4️⃣ sort newest → oldest
  published.sort(
    (a, b) =>
      new Date(b.frontmatter.pubDate).getTime() -
      new Date(a.frontmatter.pubDate).getTime()
  );
  return published;
}
