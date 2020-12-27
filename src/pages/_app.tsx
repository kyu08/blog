import { AppProps } from 'next/app'

import 'highlight.js/styles/ocean.css'
import styles from './_app.module.css'


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <div className={styles.haikei}>
        <Component {...pageProps} />
      </div>
    </>
  )
}
