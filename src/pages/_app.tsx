import { AppProps } from 'next/app'

import '../../styles/global.css'
import 'highlight.js/styles/ocean.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <style>
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c&display=swap');
      </style>
    </>
  )
}
