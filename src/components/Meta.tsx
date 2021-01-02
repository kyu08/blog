import Head from 'next/head'
import { BLOG_TITLE, BLOG_URL, DEFAULT_DESCRIPTION, DEFAULT_OGP_IMAGE, FAVICON } from '@/lib/config'

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
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@kyu08_" />
      <meta name="twitter:url" content={image} />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <link rel="canonical" href={url} />
      <link rel="shortcut icon" href={FAVICON} />
      <link rel="apple-touch-icon" href={FAVICON} />
    </Head>
  )
}

export default Meta
