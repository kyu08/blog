import Link from 'next/link'
import UnderLine from '@/components/UnderLine'

export default function PostCard(props: {
  // todo ここ Type でかこう
  post: { id: string; published: string; title: string }
}) {
  const { published } = props.post
  return (
    <>
      <article>
        <Link href="/posts/[id]" as={`/posts/${props.post.id}`}>
          <a>
            <UnderLine>
              <h1 className="postTitle">{props.post.title}</h1>
              <time className="postedDate" dateTime={'2020-12-27'}>
                {published}•
              </time>
              <span className="postTag">#TypeScript #Next.js</span>
            </UnderLine>
          </a>
        </Link>
      </article>

      <style jsx>{`
        .postTitle {
          color: var(--text-sub-color);
          margin-bottom: 0;
        }

        .postedDate {
          margin-right: 5px;
        }

        .postTag {
          font-size: 13px;
          color: var(--text-gray-color);
        }
      `}</style>
    </>
  )
}
