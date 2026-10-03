import '../auth.form.scss'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth';
const Register = () => {
    const [username,setUsername] = useState("");
    const [email,setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [password , setPassword] = useState("");
    const {loading , handleRegister} = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async(e) => {
    e.preventDefault();
     e.preventDefault();
        if(!username || !email || !password){
            setErrorMessage("Please enter username, email and password!!!!!!!");
            return;
        }
        await handleRegister({username , email , password});
        navigate('/');
    }
    if(loading){
        return(<main><h1>Loading.....</h1></main>)
    }
    return(
        <main>
            <div className="style-card">
                <div className="form-container">
                    <h1>Register</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="name">Full Name</label>
                            <input onChange={(e) => {setUsername(e.target.value)}} value={username}
                            type="text" name="name" id="name" placeholder="Enter your full name" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input onChange={(e) => {setEmail(e.target.value)}} value={email}
                            type="email" name="email" id="email" placeholder="Enter your email" />
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input onChange={(e) => {setPassword(e.target.value)}} value={password}
                            type="password" name="password" id="password" placeholder="Enter your password" />
                        </div>
                        {errorMessage && <p className='error-msg' role='alert'>{errorMessage}</p>}
                        <button type="submit" className="button primary-button">Register</button>
                    </form>
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </div>
        </main>
    );
}

export default Register