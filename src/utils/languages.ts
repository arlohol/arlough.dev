export interface Language {
  name: string;
  iconName: string;
  className?: string;
}

export const languages: Record<string, Language> = {


  python: {
    name: "Python",
    iconName: "python"
  },
  docker: {
    name: "Docker",
    iconName: "docker"
  },
  terraform: {
    name: "Terraform",
    iconName: "terraform"
  },
  html: {
    name: "HTML 5",
    iconName: "html",
  },
  strata: {
    name: "Strata NGFW",
    iconName: "strata",
  },
  scm: {
    name: "Strata Cloud Manager",
    iconName: "strata",
  },
  prismaAccess: {
    name: "Prisma Access",
    iconName: "prisma",
  },
  prismaSDWAN: {
    name: "Prisma SD-WAN",
    iconName: "prisma",
  },
  prismaAccessBrowser: {
    name: "Prisma Access Browser",
    iconName: "prisma"
  },
  cortexXDR: {
    name: "Cortex XDR",
    iconName: "cortex",
  },
  cortexXSOAR: {
    name: "Cortex XSOAR",
    iconName: "cortex"
  },
  cortexXSIAM: {
    name: "Cortex XSIAM",
    iconName: "cortex"
  },
  markdown: {
    name: "Markdown",
    iconName: "markdown"
  }
};

export const getLanguage = (lang: string): Language => {
  return languages[lang] || languages.html;
}; 