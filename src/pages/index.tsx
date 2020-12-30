import { InferGetStaticPropsType, GetStaticProps } from 'next'
import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'

import styles from './index.module.css'
import Meta from '@/components/Meta'
import { BLOG_TITLE } from '@/lib/util'

export const getStaticProps: GetStaticProps<{
  posts: ReturnType<typeof getSortedPostsData>
}> = async () => {
  const posts = await getSortedPostsData()
  return { props: { posts } }
}

const Index = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Meta />
      <h1 className={styles.heading}>{BLOG_TITLE}</h1>
      <div>
        {posts.map(post => (
          <article key={post.id}>
            <div className={styles.underLineContainer}>
              <Link href="/posts/[id]" as={`/posts/${post.id}`}>
                <a>
                  <h1 className={styles.postTitle}>{post.title}</h1>
                  <time className={styles.postedDate} dateTime={'2020-12-27'}>
                    2020/12/27•
                  </time>
                  <span>TypeScript,Next.js</span>
                </a>
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

export default Index
