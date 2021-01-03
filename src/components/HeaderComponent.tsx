import Link from 'next/link'
import { BLOG_TITLE } from '@/lib/config'

export default function HeaderComponent() {
  return (
    <>
      <Link href="/">
        <a>
          <h1 className="heading">{BLOG_TITLE}</h1>
        </a>
      </Link>
      <style jsx>{`
        .heading {
          font-size: 24px;
          font-weight: bold;
          margin: 0;
        }
      `}</style>
    </>
  )
}
