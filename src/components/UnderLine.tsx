export default function UnderLine({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="underLine">{children}</div>
      <style jsx>{`
        .underLine {
          border-bottom: #a9b7c6 1px solid;
        }
      `}</style>
    </>
  )
}
