import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <>
      <p className={styles.footer}>©︎{year} kyu08, All Rights Reserved</p>
      <p className={styles.footer}>This site uses Google Analytics.</p>
    </>
  )
}
