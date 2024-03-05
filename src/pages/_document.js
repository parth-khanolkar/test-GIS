import { Html, Head, Main, NextScript } from "next/document";
import Link from "next/link";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        
        <link rel="apple-touch-icon" sizes="180x180" href="/favicons/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png"/>
        <link rel="manifest" href="/favicons/site.webmanifest"/>
        
        <link
          // href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        {/* <!-- Google Tag Manager --> */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-PV2PPGKQ');
            `,
          }}
        />


        {/* <!-- End Google Tag Manager --> */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
