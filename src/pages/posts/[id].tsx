import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { getPostData, getAllPostIds, Post } from '@/lib/posts'
import Meta from '@/components/Meta'
import UnderLine from '@/components/UnderLine'

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = await getAllPostIds()
  return {
    paths: ids.map(id => ({ params: { id } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Post, { id: string }> = async ({ params }) => {
  const post = await getPostData((params || {}).id as string)
  return { props: post }
}

const PostPage = ({ title, content }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Meta title={title} description={content} />
      <article className="article-content">
        <h1>{title}</h1>
        <UnderLine>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </UnderLine>
      </article>
    </>
  )
}

export default PostPage
