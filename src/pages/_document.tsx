import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        <link rel="shortcut icon" href="/favicon.png" type="image/x-icon" />
      </Head>
      <body className="bg-bk-gray-800">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
