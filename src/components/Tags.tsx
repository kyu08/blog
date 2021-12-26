export default function Tags(props: { tags_: string[] }) {
  if (props.tags_?.length > 0) {
    return (
      <>
        <span className="postTag">{props.tags_.map(t => '#' + t).join(' ')}</span>
        <style jsx>{`
          .postTag {
            font-size: 13px;
            color: var(--text-gray-color);
          }
        `}</style>
      </>
    )
  }
  return null
}
