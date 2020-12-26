import { AppProps } from "next/app";

import 'minireset.css'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}