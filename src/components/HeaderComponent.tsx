import styles from '@/pages/index.module.css'
import { BLOG_TITLE } from '@/lib/util'

export default function HeaderComponent() {
  return <h1 className={styles.heading}>{BLOG_TITLE}</h1>
}
