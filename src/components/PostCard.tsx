import styles from '@/pages/index.module.css'
import Link from 'next/link'

export default function PostCard(props: {
  post: { fileName: string; id: string; published: string; title: string; content: string }
}) {
  return (
    <article>
      <div className={styles.underLineContainer}>
        <Link href="/posts/[id]" as={`/posts/${props.post.id}`}>
          <a>
            <h1 className={styles.postTitle}>{props.post.title}</h1>
            <time className={styles.postedDate} dateTime={'2020-12-27'}>
              2020/12/27•
            </time>
            <span>TypeScript,Next.js</span>
          </a>
        </Link>
      </div>
    </article>
  )
}
