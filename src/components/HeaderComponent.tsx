import Link from 'next/link'
import styles from '@/pages/index.module.css'
import { BLOG_TITLE } from '@/lib/util'

export default function HeaderComponent() {
  return (
    <>
      <Link href="/">
        <a>
          <h1 className={styles.heading}>{BLOG_TITLE}</h1>
        </a>
      </Link>
    </>
  )
}
