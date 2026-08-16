import {Navigate} from 'react-router-dom'
import useAuth from '../hooks/UseAuth'


function Protected(props) {
    const [...context] = useAuth();
    const { accesstoken } = context[14];
    return accesstoken
        ? props.children
        : <Navigate to="/"/>
    
}
export default Protected