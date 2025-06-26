import Head from 'next/head';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Keep Typing</title>
        <meta name="description" content="A minimalistic typing test app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>
          Welcome to Keep Typing!
        </h1>
      </main>
    </div>
  );
}
