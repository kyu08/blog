import Head from 'next/head'
import { BLOG_TITLE } from '@/lib/util'

const Meta = ({ title = '' }) => {
  const MetaTitle = title !== '' ? `${title} - ${BLOG_TITLE}` : BLOG_TITLE
  return (
    <Head>
      <meta name="og:title" content={MetaTitle} />
      <title>{MetaTitle}</title>
    </Head>
  )
}

export default Meta
