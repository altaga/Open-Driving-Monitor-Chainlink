
import Head from 'next/head'
import MainPage from './mainPage'
import MyHeader from '../components/myHeader'

export default function Home() {
  return (
    <>
      <Head>
        <title>Open Driving Marketplace</title>
        <meta name="description" content="Open Driving Marketplace Webpage" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{height: "100vh", width: "100vw"}}>
        <MyHeader/>
        <MainPage/>
      </div>
    </>
  )
}
