export interface Post {
  id: number
  slug: string
  title: string
  category: string
  status: string
  postDate: string
  excerpt: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface Work {
  id: number
  slug: string
  title: string
  tag: string
  description: string
  content: string
  link: string
  featured: boolean
  createdAt: string
}

export interface SiteInfo {
  aboutText: string
  contactEmail: string
  github: string
  techStack: string[]
  updatedAt: string
}

export interface PostInput {
  slug: string
  title: string
  category: string
  status: string
  postDate: string
  excerpt: string
  content: string
}

export interface WorkInput {
  slug: string
  title: string
  tag: string
  description: string
  content: string
  link: string
  featured: boolean
}
