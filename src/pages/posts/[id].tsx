import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { getPostData, getAllPostIds, Post } from '@/lib/posts'
import Meta from '@/components/Meta'
import UnderLine from '@/components/UnderLine'
import ContentHeader from '@/components/ContentHeader'

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

const PostPage = ({
  title,
  content,
  published,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Meta title={title} description={content} />
      <article className="article-content">
        <h1>{title}</h1>
        <ContentHeader publishedAt={published} />
        <UnderLine>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </UnderLine>
      </article>
    </>
  )
}

export default PostPage
