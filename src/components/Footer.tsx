import styles from './Footer.module.css'

export default function Footer() {
  const year = 2020
  return (
    <>
      <p className={styles.footer}>©︎{year} kyu08, All Rights Reserved</p>
    </>
  )
}
