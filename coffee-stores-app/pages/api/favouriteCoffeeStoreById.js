import { getCoffeeStoreDb, updateCoffeeStoreDb } from "../../lib/airtable"
import { err400Res, err500Res, okRes } from "../../lib/serverless"

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === "PUT") {
    const { id } = req.body

    try {
      if (id) {
        let coffeeStore = await getCoffeeStoreDb(id)
        if (coffeeStore) {
          coffeeStore.voting += 1
          const updatedCoffeeStore = await updateCoffeeStoreDb(coffeeStore)
          if(updatedCoffeeStore) okRes(res, updatedCoffeeStore)
          else err500Res(res, "updateCoffeeStoreDb went wrong!")
        }
        else err500Res(res, "Id could be not found!")
      } else err400Res(res, "Id is missing")
    } catch (error) {
      console.log("Error: ", error)
      err500Res(res, "Error upvoting coffee store!")
    }
  }
}

export default favouriteCoffeeStoreById
