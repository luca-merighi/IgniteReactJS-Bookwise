import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'

import { Nunito } from 'next/font/google'
import '@/styles/globals.css'

export const nunito = Nunito({ subsets: ['latin'] })

export default function App({
  Component,
  pageProps: { session, ...pageProps }}: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <div className={nunito.className}>
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </QueryClientProvider>
  )
}
