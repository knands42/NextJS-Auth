import axios from "axios"
import { Cookies } from "contexts/AuthContext/types"
import { parseCookies } from "nookies"

const cookies = parseCookies()

export const api = axios.create({
  baseURL: "http://localhost:3333",
  headers: {
    Authorization: `Bearer ${cookies[Cookies.token]}`
  }
})

