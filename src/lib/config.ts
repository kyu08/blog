export const BLOG_TITLE = 'blog.kyu08.com'
export const BLOG_URL = 'https://blog.kyu08.com/'
// S3 じゃなくて Repo 内に画像置くのじゃだめなんだっけ
export const DEFAULT_OGP_IMAGE =
  'https://s3-ap-northeast-1.amazonaws.com/blog.kyu08.com/defaultOgp.png'
export const DEFAULT_DESCRIPTION = 'kyu08のブログです'
// S3 じゃなくて Repo 内に画像置くのじゃだめなんだっけ
export const FAVICON = 'https://s3-ap-northeast-1.amazonaws.com/blog.kyu08.com/favicon.png'
export const TWITTER_PROFILE_LINK = 'https://twitter.com/kyu08_'
export const GITHUB_PROFILE_LINK = 'https://github.com/kyu08/'

type postsDirectoryType = 'postsForDev' | 'posts' | 'temp_posts'

// todo MODE を切り替えればすべて切り替わるようにしたい
// type modeType = 'dev' | 'prod'
// const MODE: modeType = 'dev'
// const postsDirectoryMap: Map<modeType, postsDirectoryType> = new Map([
//   ['dev', 'postsForDev'],
//   ['prod', 'posts'],
// ])

// FIXME: 動作確認用に一時的に書き換えている。あとで戻す
// export const postsDirectory: postsDirectoryType = 'posts'
export const postsDirectory: postsDirectoryType = 'temp_posts'
