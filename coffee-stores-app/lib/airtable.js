import httpService from "./http-service"

const options = {
  headers: {
    Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
  },
}

const baseId = "app7EkZlgr6G3em2x"
const coffeeStoreTableId = "tblDEHLQmAmG7tRKi"

export const get = async (url, payload) => {
  if (payload) return await httpService.get(url, payload, options)
  return await httpService.get(url, null, options)
}

export const post = async (url, payload) => {
  return await httpService.post(url, payload, options)
}

export const put = async (url, payload) => {
  return await httpService.put(url, payload, options)
}

export const getCoffeeStoreDb = async (id) => {
  const {data, error} = await get(`https://api.airtable.com/v0/${baseId}/${coffeeStoreTableId}?filterByFormula=id="${id}"`)
  if(data) {
    if(data.records.length > 0) return {
      ...data.records[0].fields,
      airId: data.records[0].id
    }
    else return null
  }
  else {
    console.log("error - getCoffeeStoreDb", error)
    return null
  }
}

export const createCoffeeStoreDb = async ({ id, name, neighbourhood, address, imgUrl, voting }) => {
  const {data, error} = await post(`https://api.airtable.com/v0/${baseId}/${coffeeStoreTableId}`,{
    records: [
      { fields: { id, name, neighbourhood, address, imgUrl, voting: voting > 0 ? voting : 0 }}
    ]
  })
  if(data) return data.records[0].fields
  else {
    console.log("error - createCoffeeStoreDb", error)
    return null
  }
}

export const updateCoffeeStoreDb = async ({ id, name, neighbourhood, address, imgUrl, voting, airId }) => {
  const {data, error} = await put(`https://api.airtable.com/v0/${baseId}/${coffeeStoreTableId}/${airId}`,{
    fields: { id, name, neighbourhood, address, imgUrl, voting: voting > 0 ? voting : 0 }
  })
  if(data) return data
  else {
    console.log("error - updateCoffeeStoreDb", error)
    return null
  }
}
