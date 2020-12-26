import { InferGetStaticPropsType, GetStaticProps } from 'next'
import Link from 'next/link'
import { getSortedPostsData } from '@/lib/posts'

import styles from './index.module.css'

export const getStaticProps: GetStaticProps<{
  posts: ReturnType<typeof getSortedPostsData>
}> = async () => {
  const posts = await getSortedPostsData()
  return { props: { posts } }
}

const Index = ({ posts }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <h1 className={styles.heading}>Awesome BLOG</h1>
      <div>
        {posts.map(post => (
          <article key={post.id}>
            <Link href="/posts/[id]" as={`/posts/${post.id}`}>
              <a>
                <h1>{post.title}</h1>
              </a>
            </Link>
          </article>
        ))}
      </div>
    </>
  )
}

export default Index