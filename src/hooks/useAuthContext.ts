import { AuthContext } from 'contexts/AuthContext'
import { useContext } from 'react'

const useAuthContext = () => useContext(AuthContext)

export { useAuthContext }
