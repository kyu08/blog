import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
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
  return fs.readdirSync(POSTS_DIRECTORY)
  // const fileNames = fs.readdirSync(POSTS_DIRECTORY)
  // return fileNames.map(fileName => {
  //   return fileName.replace(/\.md$/, '')
  // })
}

const POST_FILE_NAME = 'index.md'

// ここで id をファイル名にする
export function getSortedPostsData(): PostCard[] {
  const postDirNames = fs.readdirSync(POSTS_DIRECTORY)
  const postsData = postDirNames.map(postDirName => {
    const fullPath = path.join(POSTS_DIRECTORY, postDirName, POST_FILE_NAME)
    try {
      const fileContent = fs.readFileSync(fullPath, 'utf8')
      const matterResult = matter(fileContent)
      return {
        ...(matterResult.data as MatterResult),
        id: postDirName
      }
    } catch (err) {
      return undefined
    }
  }).filter(elem => elem !== undefined) as PostCard[]
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
  const fullPath = path.join(POSTS_DIRECTORY, id, POST_FILE_NAME)
  const fileContent = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContent)
  const matterResultData = matterResult.data as MatterResult

  return {
    content: fileContent,
    ...matterResultData,
  }
}
