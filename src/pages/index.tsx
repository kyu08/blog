import { InferGetStaticPropsType, GetStaticProps } from 'next'
import { getSortedPostsData } from '@/lib/posts'

import Meta from '@/components/Meta'
import PostCardComponent from '@/components/PostCardComponent'

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
      {posts.map(post => (
        <PostCardComponent key={post.id} post={post} />
      ))}
    </>
  )
}

export default Index
