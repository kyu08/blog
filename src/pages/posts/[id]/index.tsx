import {GetStaticPaths, GetStaticProps, NextPage} from "next";

type Props = {
  title: string
  content: string
}

const Post: NextPage<Props> = ({ title, content }) => {
  return (
    <>
      <h1>{title}</h1>
      <p>{content}</p>
    </>
  )
}

export default Post

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [
      { params: { id: '1' } },
      { params: { id: '2' } },
    ],
    fallback: false
  }
}

const dummyData = {
  1: {
    title: 'id1のtitle',
    content: 'id1のcontext',
  },
  2: {
    title: 'id2のtitle',
    content: 'id2のcontext',
  },
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const props: Props = dummyData[params!.id as '1' | '2']
  return { props }
}