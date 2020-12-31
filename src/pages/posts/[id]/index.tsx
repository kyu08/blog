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

export const getStaticProps: GetStaticProps<Post, { id: string }> = async context => {
  const post = await getPostData((context.params || {}).id as string)
  return { props: post }
  // error をキャッチ？
}

const PostPage = ({ title, content }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Meta title={title} />
      <h1>{title}</h1>
      <article className="article-content">
        <UnderLine>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </UnderLine>
      </article>
    </>
  )
}

export default PostPage
