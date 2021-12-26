type Props = {
  publishedAt_: string
}

export default function PublishedAt(props: Props) {
  return (
    <>
      <time className="postedDate" dateTime={props.publishedAt_}>
        {props.publishedAt_}
      </time>
      <style jsx>{`
        .postedDate {
          margin-right: 5px;
        }
      `}</style>
    </>
  )
}
