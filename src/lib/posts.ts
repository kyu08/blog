import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import markdown from 'remark-parse'
import remark from 'remark'
import html from 'remark-html'
// @ts-ignore
import highlight from 'remark-highlight.js'
import { postsDirectory } from '@/lib/config'

type MatterResult = {
  content: string
  data: {
    id: string
    title: string
    published: string
  }
}

export type Post = {
  content: string
  id: string
  title: string
  published: string
}

const POSTS_DIRECTORIES = path.join(process.cwd(), postsDirectory)

const ALL_POSTS = (() => {
  const fileNames = fs.readdirSync(POSTS_DIRECTORIES)
  return fileNames.map(fileName => {
    const fullPath = path.join(POSTS_DIRECTORIES, fileName)
    const fileContent = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContent)
    const matterResultData = matterResult.data as MatterResult['data']
    return {
      content: matterResult.content,
      ...matterResultData,
      fileName,
    }
  })
})()

const ID_FILENAME_MAP = (() => {
  const map = new Map()
  ALL_POSTS.forEach(post => {
    map.set(post.id, post.fileName.replace(/\.md$/, ''))
  })
  return map
})()

// 全てのpostのid一覧を取得
export function getAllPostIds() {
  return Array.from(ID_FILENAME_MAP.keys())
}

export function getSortedPostsData() {
  return ALL_POSTS.sort((a, b) => {
    if (a.published < b.published) {
      return 1
    } else {
      return -1
    }
  })
}

// idからpostを取得する
export async function getPostData(id: string): Promise<Post> {
  const post: Post = ALL_POSTS.find(post => id === post.id)

  const processedContent = await remark()
    .use(markdown)
    .use(highlight)
    .use(html)
    .process(post.content)
  const content = processedContent.toString()

  return {
    ...post,
    content,
  }
}
