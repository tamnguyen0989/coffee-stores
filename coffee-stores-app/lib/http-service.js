// import { auth } from "../firebase/firebase.utils"

class HttpService {
   constructor() {
      this.headers = {
         "Content-Type": "application/json",
      }
   }

   setHeader(key, value) {
      this.headers = {
         ...this.headers,
         [key]: value,
      }
   }

   async get(url, params, options = {}) {
      let requestUrl = url
      let data, error
      const query = new URLSearchParams()
      if (params && Object.keys(params).length > 0) {
         Object.keys(params).forEach((k) => {
            if (Array.isArray(params[k])) {
               params[k].forEach((paramData) => {
                  query.append(k, paramData)
               })
            } else if (params[k]) {
               query.set(k, params[k])
            }
         })
         requestUrl += `?${query.toString()}`
      }

      const init = await this._buildRequestInit({
         method: "GET",
         ...options,
      })

      const request = new Request(requestUrl, init)
      try {
         const res = await fetch(request)
         let resData = null
         if (res.ok) {
            resData = await res.json()
            data = resData
         } else
            error = {
               statusCode: res.status,
               message: resData?.error || resData?.message || resData,
            }
      } catch (err) {
         error = err
      }
      return { data, error }
   }

   async put(url, payload, options = {}) {
      let data = null,
         error = null

      const init = await this._buildRequestInit({
         method: "PUT",
         body: JSON.stringify(payload),
         ...options,
      })

      const request = new Request(url, init)

      try {
         const res = await fetch(request)
         let resData = null
         if (res.ok) {
            data = true
         } else
            error = {
               statusCode: res.status,
               message: resData?.error || resData?.message || JSON.stringify(resData),
            }
      } catch (err) {
         error = err
      }

      return { data, error }
   }

   async post(url, payload, options = {}) {
      let data = null,
         error = null

      const init = await this._buildRequestInit({
         method: "POST",
         body: JSON.stringify(payload),
         ...options,
      })

      const request = new Request(url, init)

      try {
         const res = await fetch(request)
         let resData = null
         if (res.ok) {
            const contentType = res.headers.get("content-type")
            if (contentType && contentType.indexOf("application/json") !== -1) {
               resData = await res.json()
            } else {
               resData = true
            }
            data = resData
         } else
            error = {
               statusCode: res.status,
               message: resData?.error || resData?.message || res.statusText,
            }
      } catch (err) {
         error = err
      }

      return { data, error }
   }

   async delete(url, options = {}) {
      let data = null,
         error = null

      const init = await this._buildRequestInit({
         method: "DELETE",
         ...options,
      })
      const request = new Request(url, init)

      try {
         const res = await fetch(request)
         if (res.ok) data = true
         else
            error = {
               statusCode: res.status,
               message: await res.json(),
            }
      } catch (err) {
         error = err
      }

      return { data, error }
   }

   async _buildRequestInit(options) {
      // const idToken = (await auth.currentUser.getIdToken()) || null
      // this.setHeader("Authorization", idToken)
      const init = {
         ...options,
         headers: {
            ...this.headers,
            ...options?.headers,
         },
      }
      //console.log('...init', init);
      return init
   }
}

const httpService = new HttpService()

export default httpService
