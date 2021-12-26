import Link from 'next/link'
import UnderLine from '@/components/UnderLine'
import Tags from '@/components/Tags'
import { PostCard } from '@/lib/posts'
import PublishedAt from './PublishedAt'

export default function PostCardComponent(props: { post: PostCard }) {
  const { publishedAt, tags } = props.post

  return (
    <>
      <article>
        <Link href="/posts/[id]" as={`/posts/${props.post.id}`}>
          <a>
            <UnderLine>
              <h1 className="postTitle">{props.post.title}</h1>
              <PublishedAt publishedAt_={publishedAt} />
              <Tags tags_={tags} />
            </UnderLine>
          </a>
        </Link>
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
