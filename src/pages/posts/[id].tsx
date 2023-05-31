import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { getPostData, getAllPostIds, Post } from '@/lib/posts'
import Tags from '@/components/Tags'
import UnderLine from '@/components/UnderLine'
import PublishedAt from '@/components/PublishedAt'
import { useEffect, useState, createElement, Fragment, JSXElementConstructor, ReactElement } from 'react'
import rehypeReact from 'rehype-react'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import unified from 'unified'
import PostImage from '@/components/PostImage'

export const getStaticPaths: GetStaticPaths = async () => {
  const ids = getAllPostIds()
  return {
    paths: ids.map(id => ({ params: { id } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps<Post, { id: string }> = async ({ params }) => {
  const post = await getPostData((params || {}).id as string)
  return { props: post }
}

async function markdownToReact(markdown: string, id: string) {
  const result = (await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeReact, {
      createElement,
      Fragment,
      components: {
        img: PostImage(id)
      }
    })
    .process(markdown)).result as ReactElement<unknown, string | JSXElementConstructor<any>>
  return result
}

const PostPage = ({
  id,
  title,
  content,
  publishedAt,
  tags,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  console.log({ id })
  const [component, setComponent] = useState(<Fragment />)
  useEffect(() => {
    ; (async () => {
      const contentComponent: ReactElement<unknown, string | JSXElementConstructor<any>> = await markdownToReact(content, id)
      setComponent(contentComponent)
    })()
    return () => { }
  }, [content])

  return (
    <>
      {/*<Meta title={title} description={content} />*/}
      <article className="article-content">
        <UnderLine>
          <h1 className="postTitle">{title}</h1>
          <PublishedAt publishedAt_={publishedAt} />
          <Tags tags_={tags} />
        </UnderLine>
        {component}
        {/*<UnderLine>{content}</UnderLine>*/}
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
