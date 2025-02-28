import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'docs/blog')

interface BlogPost {
  slug: string
  path: string
  title: string
  description?: string
  content: string
  date?: string
}

export async function getBlogContent(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.md`)
    const fileContent = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(fileContent)
    
    return {
      slug,
      path: `/blog/${slug}`,
      title: data.title || slug,
      description: data.description,
      content,
      date: data.date
    }
  } catch (error) {
    return null
  }
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    await fs.access(BLOG_DIR)
    const files = await fs.readdir(BLOG_DIR)
    
    const posts = await Promise.all(
      files
        .filter(file => file.endsWith('.md'))
        .map(async file => {
          const slug = file.replace('.md', '')
          const post = await getBlogContent(slug)
          return post
        })
    )

    return posts
      .filter((post): post is BlogPost => post !== null)
      .sort((a, b) => {
        if (!a.date || !b.date) return 0
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
  } catch (error) {
    console.error('Error reading blog directory:', error)
    return []
  }
}
