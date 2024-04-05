import { Outlet, Navigate } from 'react-router-dom'

const PrivateRoutes = () => {
    let auth = {'token':sessionStorage.getItem('userToken') ? true : false}
    console.log(auth.token)
    console.log(sessionStorage.getItem('userToken'))
    return(
        auth.token ? <Outlet/> : <Navigate to="/"/>
    )
}

export default PrivateRoutes