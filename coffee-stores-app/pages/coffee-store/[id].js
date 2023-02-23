import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/router"
import useSWR from "swr"
import cls from "classnames"
import styles from "../../styles/coffee-store.module.css"
import { createCoffeeStoreFE, getCoffeeStoresFE, favouriteCoffeeStoreByIdFE } from "../../client/coffee-store"
import { useContext, useEffect, useState } from "react"
import { StoreContext } from "../../store/store-context"
import { fetcher, isEmpty } from "../../utils"

export async function getStaticProps({ params }) {
  const coffeeStores = await getCoffeeStoresFE()
  const findCoffeeStoreById = coffeeStores.find(
    (store) => store.id.toString() === params.id
  )
  return {
    // Passed to the page component as props
    props: {
      coffeeStore: findCoffeeStoreById ? findCoffeeStoreById : {},
    },
  }
}

export async function getStaticPaths() {
  const coffeeStores = await getCoffeeStoresFE()

  const paths = coffeeStores.map((store) => {
    return {
      params: {
        id: store.id.toString(),
      },
    }
  })
  return {
    paths,
    fallback: true,
  }
}

const CoffeeStore = (initialProps) => {
  const router = useRouter()
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore)
  const [votingCount, setVotingCount] = useState(0)

  const {
    query: { id },
  } = router
  const {
    state: { coffeeStores },
  } = useContext(StoreContext)

  const handleUpvoteButton = () => {
    setVotingCount(votingCount + 1)
    favouriteCoffeeStoreByIdFE(id)
  }

  const handleCreateCoffeeStore = async (coffeeStore) => {
    await createCoffeeStoreFE(coffeeStore)
  }

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStorById = coffeeStores.find(store => store.id.toString() === id)
        setCoffeeStore(coffeeStorById)
        handleCreateCoffeeStore(coffeeStorById)
      }
    }
    else handleCreateCoffeeStore(initialProps.coffeeStore)
  }, [id, initialProps, initialProps.coffeeStore])

  let name = "", address="", neighborhood = "", imgUrl = ""
  if(coffeeStore){
    name= coffeeStore.name
    address= coffeeStore.address
    neighborhood= coffeeStore.neighborhood
    imgUrl= coffeeStore.imgUrl
  }
  

  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher)

  useEffect(() => {
    if(data){
      console.log('...data SWR', data);
      setCoffeeStore(data)
      setVotingCount(data.voting)
    }
  }, [data])

  if (router.isFallback) return <div>loading...</div>
  if (error) return <div>Something went wrong retrieving coffee store page</div>

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee store`} />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">← Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          {address && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/places.svg"
                width="24"
                height="24"
                alt="places icon"
              />
              <p className={styles.text}>{address}</p>
            </div>
          )}
          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="near me icon"
              />
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="star icon"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  )
}

export default CoffeeStore
