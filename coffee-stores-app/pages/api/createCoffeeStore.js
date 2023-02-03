import { getCoffeeStoreDb, createCoffeeStoreDb } from "../../lib/airtable"
import { err400Res, err500Res } from "../../lib/serverless"

const createCoffeeStore = async (req, res) => {
  if (req.method === "POST") {
    
    try {
      const { id, name, neighbourhood, address, imgUrl, voting } = req.body
      if (id) {
        res.status(200)
        const coffeeStore = await getCoffeeStoreDb(id)
        if (coffeeStore) res.json(coffeeStore)
        else {
          if (name) {
            const payload = { id, name, neighbourhood, address, imgUrl, voting }
            const newCoffeeStore = await createCoffeeStoreDb(payload)
            if (newCoffeeStore) res.json(newCoffeeStore)
            else err500Res(res, "Something went wrong!")
          } else err400Res(res, "Name is missing")
        }
      } else err400Res(res, "Id is missing")
    } catch (error) {
      console.log("Error: ", error)
      err500Res(res, "Something went wrong!")
    }
  }
}

export default createCoffeeStore
