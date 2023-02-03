export const okRes = (res, object) => {
  res.status(200)
  res.json(object)
}

export const err400Res = (res, message) => {
  res.status(400)
  res.json({ message })
}

export const err500Res = (res, message) => {
  res.status(500)
  res.json({ message })
}