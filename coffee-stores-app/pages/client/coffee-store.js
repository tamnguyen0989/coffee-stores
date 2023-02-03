import httpService from "../../lib/http-service"
import { createApi } from "unsplash-js"

// on your node server
const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
})

const optionsFourSquare = {
  headers: {
    Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_ACCESS_TOKEN,
  },
}

const randomIntFromInterval = (min, max) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const getCoffeeStorePhotos = async () => {
  const unsplashResult = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 30,
  })
  const photos = unsplashResult.response.results
  return photos.map((result) => result.urls["small"])
}

export const getCoffeeStore = (data) => {
  const {
    fsq_id,
    name,
    location: { address, neighborhood },
  } = data
  return {
    id: fsq_id,
    name,
    address,
    neighborhood: neighborhood?.length > 0 ? neighborhood[0] : "",
  }
}

export const getCoffeeStoresFE = async (ll = "43.653833032607096,-79.37896808855945") => {
  const photos = await getCoffeeStorePhotos()
  const payload = {
    query: "coffee",
    ll,
    limit: 6,
  }
  const { data, error } = await httpService.get(
    "https://api.foursquare.com/v3/places/search",
    payload,
    optionsFourSquare
  )
  if (data?.results?.length > 0) {
    return data.results.map((result, idx) => {
      const rndPhoto = randomIntFromInterval(0, 29)
      return { ...getCoffeeStore(result), imgUrl: photos[rndPhoto] }
    })
  } else {
    console.log("error", error)
    return []
  }
}

export const createCoffeeStoreFE = async ({ id, name, neighbourhood, address, imgUrl, voting }) => {
  if(!id || !name) throw new Error("Id or name is missing!")
  const payload = { id, name, neighbourhood, address, imgUrl, voting }
  const { data, error } = await httpService.post("/api/createCoffeeStore", payload)
  if(data) return data
  else throw new Error("Error: ", error)
}

export const favouriteCoffeeStoreByIdFE = async (id) => {
  if(!id) throw new Error("Id or name is missing!")
  const payload = { id }
  const { data, error } = await httpService.put("/api/favouriteCoffeeStoreById", payload)
  if(data) return data
  else throw new Error("Error: ", error)
}
