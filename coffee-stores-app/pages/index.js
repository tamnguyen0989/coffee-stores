import Head from "next/head"
import Image from "next/image"
import styles from "../styles/Home.module.css"
import Banner from "../components/banner"
import Card from "../components/card"
import { getCoffeeStoresFE } from "./client/coffee-store"
import { useContext, useEffect, useState } from "react"
import useTrackLocation from "../hooks/use-track-location"
import { StoreContext, ACTION_TYPES } from "../store/store-context"
import httpService from "../lib/http-service"

export async function getStaticProps(context) {
  let coffeeStoresData = []
  const coffeeStores = await getCoffeeStoresFE()
  if (coffeeStores.length) coffeeStoresData = coffeeStores

  return {
    props: {
      coffeeStores: coffeeStoresData,
    }, // will be passed to the page component as props
  }
}

export default function Home(props) {
  //const [coffeeStores, setCoffeeStores] = useState([])
  const [coffeeStoresError, setCoffeeStoresError] = useState(null)
  const {
    state: { latLong, coffeeStores },
    dispatch
  } = useContext(StoreContext)

  const { handleTrackLocation, locationErrorMsg, isFindingLocation } =
    useTrackLocation()

  const handleViewStore = () => {
    handleTrackLocation()
  }

  useEffect(() => {
    const fetchCoffeeStoresByLocation = async () => {
      if (latLong) {
        try {
          // const coffeeStoresFetched = await getCoffeeStoresFE(latLong)
          const response = await httpService.get(`/api/getCoffeeStoresByLocation?ll=${latLong}`)
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores: response.data
            }
          })
          setCoffeeStoresError("")
        } catch (error) {
          console.error({ error })
          setCoffeeStoresError(error.message)
        }
      }
    }

    fetchCoffeeStoresByLocation()
  }, [latLong])

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleViewStore={handleViewStore}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="hero image"
          />
        </div>

        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${coffeeStore.id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}

        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Toronto stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => (
                <Card
                  key={coffeeStore.id}
                  name={coffeeStore.name}
                  imgUrl={
                    coffeeStore.imgUrl ||
                    "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                  }
                  href={`/coffee-store/${coffeeStore.id}`}
                  className={styles.card}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
