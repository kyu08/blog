import { AppProps } from 'next/app'

import '../../styles/global.css'
import 'highlight.js/styles/ocean.css'
import HeaderComponent from '@/components/HeaderComponent'
import Footer from '@/components/Footer'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <HeaderComponent />
      <Component {...pageProps} />
      <Footer />
      <style>
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c&display=swap');
      </style>
    </>
  )
}
