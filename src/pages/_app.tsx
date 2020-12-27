import { AppProps } from 'next/app'

import 'minireset.css'
import 'highlight.js/styles/ocean.css'


export default function App({ Component, pageProps }: AppProps){
  return <Component {...pageProps} />
}
