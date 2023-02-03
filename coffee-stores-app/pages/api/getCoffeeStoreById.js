import { getCoffeeStoreDb } from "../../lib/airtable"
import { err400Res, err500Res, okRes } from "../../lib/serverless"

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query

  try {
    if (id) {
      const coffeeStore = await getCoffeeStoreDb(id)
      if (coffeeStore) okRes(res, coffeeStore)
      else err500Res(res, "Id could be not found!")
    } else err400Res(res, "Id is missing")
  } catch (error) {
    console.log("Error: ", error)
    err500Res(res, "Something went wrong!")
  }
}

export default getCoffeeStoreById
