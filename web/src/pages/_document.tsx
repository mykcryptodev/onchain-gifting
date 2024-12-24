import { Html, Head, Main, NextScript } from 'next/document'

const frame = {
  version: "next",
  imageUrl: "https://onchaingift.com/api/og",
  button: {
    title: "Launch Frame",
    action: {
      type: "launch_frame",
      name: "Onchain Gift",
      url: "https://onchaingift.com",
      splashImageUrl: "https://onchaingift.com/images/logo.png",
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta property="og:title" content="Onchain Gift" />
        <meta property="og:description" content="Give the gift of coming onchain!" />
        <meta property="og:image" content="https://onchaingift.com/api/og" />
        <meta name="fc:frame" content={JSON.stringify(frame)} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 