export default function UnderLine({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="underLine">{children}</div>
      <style jsx>{`
        .underLine {
          border-bottom: var(--text-main-color) 2px solid;
        }
      `}</style>
    </>
  )
}
