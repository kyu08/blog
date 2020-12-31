export const BLOG_TITLE = 'blog.kyu08.com'

type modeType = 'dev' | 'prod'

type postsDirectoryType = 'postsForDev' | 'posts'

const MODE: modeType = 'dev'

const postsDirectoryMap: Map<modeType, postsDirectoryType> = new Map([
  ['dev', 'postsForDev'],
  ['prod', 'posts'],
])

export const postsDirectory: postsDirectoryType = 'posts'
// export const postsDirectory: postsDirectoryType = postsDirectoryMap.get(MODE)
