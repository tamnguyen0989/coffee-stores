import { getCoffeeStoresFE } from "../client/coffee-store"

const getCoffeeStoresByLocation = async (req, res) => {
  try {
    const { ll } = req.query
    const response = await getCoffeeStoresFE(ll)
    res.status(200)
    res.json(response)
  } catch (error) {
    console.log("Error: ", error)
    res.status(500)
    res.json({ message: "Something went wrong!" })
  }
}

export default getCoffeeStoresByLocation
