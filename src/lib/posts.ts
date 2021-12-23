import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import remark from 'remark'
import html from 'remark-html'
import slug from 'remark-slug'
import toc from 'remark-toc'
// @ts-ignore
import highlight from 'remark-highlight.js'
import { postsDirectory } from '@/lib/config'

type MatterResult = {
  id: string
  title: string
  publishedAt: string
}

export type PostCard = {
  id: string
  title: string
  publishedAt: string
}

export type Post = PostCard & {
  content: string
}

const POSTS_DIRECTORY = path.join(process.cwd(), postsDirectory)

export function getAllPostIds() {
  const fileNames = fs.readdirSync(POSTS_DIRECTORY)
  return fileNames.map(fileName => {
    return fileName.replace(/\.md$/, '')
  })
}

// ここで id をファイル名にする
export function getSortedPostsData(): PostCard[] {
  const fileNames = fs.readdirSync(POSTS_DIRECTORY)
  const postsData = fileNames.map(fileName => {
    const fullPath = path.join(POSTS_DIRECTORY, fileName)
    const fileContent = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContent)
    return {
      ...(matterResult.data as MatterResult),
      id: fileName.replace(/\.md$/, ''),
    }
  })
  return postsData.sort((a, b) => {
    if (a.publishedAt < b.publishedAt) {
      return 1
    } else {
      return -1
    }
  })
}

// idからpostを取得する
export async function getPostData(id: string): Promise<Post> {
  const fullPath = path.join(POSTS_DIRECTORY, `${id}.md`)
  const fileContent = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContent)
  const matterResultData = matterResult.data as MatterResult
  const processedContent = await remark().use(highlight).use(html).process(matterResult.content)
  const content = processedContent.toString()
  // const tocResult = await remark()
  //   .use(slug)
  //   // .use(toc, { heading: '目次', maxDepth: 2 })
  //   .use(html)
  //   .process(matterResult.content)

  return {
    content,
    ...matterResultData,
  }
}
