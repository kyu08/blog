import '../../styles/global.css'
import 'highlight.js/styles/ocean.css'

import { AppProps } from 'next/app'
import HeaderComponent from '@/components/HeaderComponent'
import Footer from '@/components/Footer'
import * as gtag from '@/lib/gtag'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

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
