import { InferGetStaticPropsType, GetStaticProps } from 'next'
import { getSortedPostsData } from '@/lib/posts'
import Author from '@/components/Author'

import Meta from '@/components/Meta'
import PostCardComponent from '@/components/PostCard'

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
      <Author />
      {posts.map(post => (
        <PostCardComponent key={post.id} post={post} />
      ))}
    </>
  )
}

export default Index
