import { NextPage } from 'next'
import { AuthProvider } from './AuthContext'

const Context: NextPage = ({ children }) => {
  return (
    <>
      <AuthProvider>{children}</AuthProvider>
    </>
  )
}

export default Context
