export const BLOG_TITLE = 'blog.kyu08.com'
export const BLOG_URL = 'https://blog.kyu08.com/'
export const DEFAULT_OGP_IMAGE =
  'https://s3-ap-northeast-1.amazonaws.com/blog.kyu08.com/defaultOgp.png'
// export const DEFAULT_OGP_IMAGE = '../../public/defaultOgp.png'
export const DEFAULT_DESCRIPTION = 'kyu08のブログです'
export const FAVICON = 'public/favicon.ico'

type modeType = 'dev' | 'prod'
type postsDirectoryType = 'postsForDev' | 'posts'
const MODE: modeType = 'dev'
const postsDirectoryMap: Map<modeType, postsDirectoryType> = new Map([
  ['dev', 'postsForDev'],
  ['prod', 'posts'],
])
export const postsDirectory: postsDirectoryType = 'posts'
// export const postsDirectory: postsDirectoryType = postsDirectoryMap.get(MODE)
