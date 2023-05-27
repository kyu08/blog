import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
// import { createElement, Fragment, JSXElementConstructor, ReactElement } from 'react'
// import rehypeReact from 'rehype-react'
// import remarkParse from 'remark-parse'
// import remarkRehype from 'remark-rehype'
// import unified from 'unified'
import { postsDirectory } from '@/lib/config'

type MatterResult = {
  id: string
  title: string
  publishedAt: string
  tags: string[]
}

export type PostCard = {
  id: string
  title: string
  publishedAt: string
  tags: string[]
}

export type Post = PostCard & {
  content: string,
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
  // const result = (await (
  //   await unified()
  //     .use(remarkParse)
  //     .use(remarkRehype)
  //     .use(rehypeReact, { createElement, Fragment })
  //     .process(fileContent)
  // ).result) as ReactElement<unknown, string | JSXElementConstructor<any>>

  return {
    content: fileContent,
    ...matterResultData,
  }
}
