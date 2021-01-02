export const BLOG_TITLE: string = 'blog.kyu08.com'
export const BLOG_URL = 'https://blog.kyu08.com/'
export const DEFAULT_OGP_IMAGE =
  'https://s3-ap-northeast-1.amazonaws.com/blog.kyu08.com/defaultOgp.png'
export const DEFAULT_DESCRIPTION = 'kyu08のブログです'
export const FAVICON = 'https://s3-ap-northeast-1.amazonaws.com/blog.kyu08.com/favicon.png'

type postsDirectoryType = 'postsForDev' | 'posts'

// todo MODE を切り替えればすべて切り替わるようにしたい
// type modeType = 'dev' | 'prod'
// const MODE: modeType = 'dev'
// const postsDirectoryMap: Map<modeType, postsDirectoryType> = new Map([
//   ['dev', 'postsForDev'],
//   ['prod', 'posts'],
// ])

export const postsDirectory: postsDirectoryType = 'posts'
