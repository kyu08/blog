export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <>
      <footer>
        <p className="footer">©︎{year} kyu08, All Rights Reserved</p>
        <p className="footer">This site uses Google Analytics.</p>
      </footer>
      <style jsx>{`
        .footer {
          text-align: center;
          margin: 30px 0;
          font-size: 13px;
          color: var(--text-gray-color);
        }
      `}</style>
    </>
  )
}
