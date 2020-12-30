import styles from './UnderLine.module.css'

export default function UnderLine({ children }: { children: React.ReactNode }) {
  return <div className={styles.underLine}>{children}</div>
}
