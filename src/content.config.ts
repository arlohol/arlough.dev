// src/content.config.ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const jsonDataCollection = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/staticData' }),
  schema: z.object({
    //Define JSON-file structure
    profileImage: z.string(),
    profileAlt: z.string(),
    profileLink: z.string(),
    profileTitle: z.string(),
    profileName: z.string(),
    github: z.string().url(),
    templateGithub: z.string().url(),
    githubText: z.string(),
    portfolioImage: z.string(),
    email: z.string().email(),
    linkedin: z.string().url(),
    instagram: z.string().url(),
    youtube: z.string().url(),
    alias: z.string(),
    contactSectionTitle: z.string(),
    contactSectionSubtitle: z.string(),
    contactSectionButtonText: z.string(),
    contactSectionButtonIcon: z.string(),
    techsTitle: z.string(),
    instagramIconName: z.string(),
    youtubeIconName: z.string(),
    githubIconName: z.string(),
    linkedinIconName: z.string(),
    emailIconName: z.string(),
    draft: z.boolean().optional()
  }),
});

export const collections = {
  staticData: jsonDataCollection,
};
