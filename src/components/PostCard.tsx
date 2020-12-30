import styles from '@/pages/index.module.css'
import Link from 'next/link'
import UnderLine from '@/components/UnderLine'

export default function PostCard(props: {
  post: { fileName: string; id: string; published: string; title: string; content: string }
}) {
  const { published } = props.post
  return (
    <article>
      <Link href="/posts/[id]" as={`/posts/${props.post.id}`}>
        <a>
          <UnderLine>
            <h1 className={styles.postTitle}>{props.post.title}</h1>
            <time className={styles.postedDate} dateTime={'2020-12-27'}>
              {published}•
            </time>
            <span className={styles.postTag}>#TypeScript #Next.js</span>
          </UnderLine>
        </a>
      </Link>
    </article>
  )
}
