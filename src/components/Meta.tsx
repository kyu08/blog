import Head from 'next/head'
import { BLOG_TITLE, BLOG_URL, DEFAULT_DESCRIPTION, DEFAULT_OGP_IMAGE } from '@/lib/config'

const Meta = ({
  title = '',
  description = DEFAULT_DESCRIPTION,
  url = BLOG_URL,
  image = DEFAULT_OGP_IMAGE,
}) => {
  const metaTitle = title !== '' ? `${title} - ${BLOG_TITLE}` : BLOG_TITLE
  return (
    <Head>
      <title>{metaTitle}</title>
      <meta name="og:title" content={metaTitle} />
      <meta name="color-scheme" content="dark light" />

      <meta property="og:description" content={description} />
      <meta property="og:type" content="blog" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={metaTitle} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@tcr_jp" />
      <meta name="twitter:url" content={image} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={url} />
      <link
        rel="shortcut icon"
        href={
          'https://cdn.qiita.com/assets/favicons/public/production-4ff10c1e1e2b5fcb353ff9cafdd56c70.ico'
        }
      />
      <link
        rel="apple-touch-icon"
        href={
          'https://cdn.qiita.com/assets/favicons/public/apple-touch-icon-f9a6afad761ec2306e10db2736187c8b.png'
        }
      />
    </Head>
  )
}

export default Meta
