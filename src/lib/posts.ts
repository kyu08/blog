import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import stringify from 'rehype-stringify'
import highlight from 'rehype-highlight'
import math from 'remark-math'
import katex from 'rehype-katex'
import raw from 'rehype-raw'

const POSTS_DIRECTORIES = path.join(process.cwd(), 'posts')

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
  const post = ALL_POSTS.find(post => id === post.id) as Post

  const processedContent = await unified()
    .use(markdown)
    .use(math)
    .use(remark2rehype, { allowDangerousHtml: true })
    .use(raw)
    .use(highlight)
    .use(katex)
    .use(stringify)
    .process(post.content)
  const content = processedContent.toString()

  return {
    ...post,
    content,
  }
}