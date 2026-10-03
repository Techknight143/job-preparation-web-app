import { useState } from 'react'
import '../auth.form.scss'
import { Link , useNavigate} from 'react-router'
import { useAuth } from '../hooks/useAuth';
const Login = () => {
    const [email,setEmail] = useState("");
    const [password , setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const {loading , handleLogin} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!email && !password){
            setErrorMessage("Please enter both email and password!!!!!!!");
            return;
        }else if(!email){
            setErrorMessage("Please enter your email !!!!!!!");
            return;
        }else if(!password){
            setErrorMessage("Please enter your password!!!!!!!");
            return;
        }
        setErrorMessage("");
        try {
            await handleLogin({email,password});
            navigate('/');
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || "Unable to log in. Please try again!!!!!"
            );
        }
    }
    if(loading){
        return (<main><h1>Loading.....</h1></main>);
    }
    return(
        <main>
            <div className='style-card'>
                <div className="form-container">
                    <h1>Login</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input onChange={(e)=>{setEmail(e.target.value)}}
                            value={email}
                            type="email" name="email" id="email" placeholder="Enter your email" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input  onChange={(e) => {setPassword(e.target.value)}}
                            value={password}
                            type="password" name="password" id="password" placeholder="Enter your password" />
                        </div>
                        {errorMessage && <p className='error-msg' role="alert">{errorMessage}</p>}
                        <button type="submit" className="button primary-button">Login</button>
                    </form>
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </div>
        </main>
    );
}

export default Login