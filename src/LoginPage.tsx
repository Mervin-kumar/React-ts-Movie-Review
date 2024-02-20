import { useForm } from "react-hook-form";
import './App.css'
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface LoginFormInput {
    phoneNumber: string;
    password: string;
}

const LoginPage = ({onChange}:any) => {
    const { register, formState, handleSubmit, reset } = useForm<LoginFormInput>();
    const { errors } = formState;
    const navigate = useNavigate();

    const onSubmit = async (data: LoginFormInput) => {
        try {
            const response = await axios.get(`http://localhost:3000/users?phoneNumber=${data.phoneNumber}&Password=${data.password}`);
            const userData = await response.data[0]; 
    
            
    
            if (userData && userData.id) { 
                localStorage.setItem('userID', userData.id);
                localStorage.setItem('firstName', userData.firstName);
                localStorage.setItem('LastName', userData.lastName);
                onChange(true)


                navigate('/main');
                toast.success('🦄 Successfully login', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                   
                    });
            } else {
                toast.warn('🦄 Invalid phone number or Password!', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                  
                    });
            }
        } catch (error) {
            console.error('Error logging in:', error);
        }
        reset();
    };

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                <h1 style={{color:'orange'}}>LOGIN FORM</h1>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input
                        type="text"
                        id='phoneNumber'
                        {...register('phoneNumber', {
                            required: 'Phone Number is required!'
                        })}
                    />
                    <p className="error">{errors.phoneNumber?.message}</p>
                </div>
                <div className="form-group">
                    <label htmlFor="Password">Password</label>
                    <input
                        type="password"
                        id='Password'
                        {...register('password', {
                            required: 'Password is required!',
                            minLength: {
                                value: 8,
                                message: 'Password must be at least 8 characters long'
                            }
                        })}
                    />
                    <p className="error">{errors.password?.message}</p>
                </div>
                <button type="submit" className="button">Login</button>
                <p>Don't have an account?<Link to='/signup'>Signup</Link> </p>
                <ToastContainer />
            </form>
        </div>
    );
}

export default LoginPage;
