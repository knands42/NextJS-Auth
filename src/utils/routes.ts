import Router from 'next/router'

const goToLogin = () => Router.push('/')
const goToDashboard = () => Router.push('/dashboard')

export { goToLogin, goToDashboard }
