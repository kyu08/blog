import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { getPostData, getAllPostIds, Post } from '@/lib/posts'
import Meta from '@/components/Meta'
import Tags from '@/components/Tags'
import UnderLine from '@/components/UnderLine'
import ContentHeader from '@/components/ContentHeader'
import PublishedAt from '@/components/PublishedAt'

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
  publishedAt,
  tags,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <Meta title={title} description={content} />
      <article className="article-content">
        <UnderLine>
          <h1 className="postTitle">{title}</h1>
          <PublishedAt publishedAt_={publishedAt} />
          <Tags tags_={tags} />
        </UnderLine>
        <UnderLine>
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </UnderLine>
      </article>
      <style jsx>{`
        .postTitle {
          color: var(--text-sub-color);
          margin-bottom: 0;
        }
      `}</style>
    </>
  )
}

export default PostPage
