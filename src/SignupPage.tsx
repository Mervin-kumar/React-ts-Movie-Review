import axios from "axios"
import { useForm } from "react-hook-form"
import { useMutation } from "react-query";
import './App.css'
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { toast ,ToastContainer} from "react-toastify";
interface FormInput{
    firstName:string;
    lastName:string;
    phoneNumber:Number;
    email:string;
    Password:string
    ConfirmPassword:string
}
const SignupPage = () => {
    const {register,formState,handleSubmit,watch}=useForm<FormInput>()
    const navigate=useNavigate()
    const{errors}=formState;
    const onSubmit=async(data:FormInput)=>{
        const response=await axios.get('http://localhost:3000/users')
        const duplicate=response.data
        if(duplicate.some((user:FormInput)=>user.email===data.email || user.phoneNumber===data.phoneNumber)){
            toast.warn('Email id or Phone number is already register',{
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
             
                })
        }
        else{
      mutation.mutate(data)
        navigate('/')
        }
    }
    const Password=watch('Password')
const createUser=async(userdata:FormInput)=>{
const response=await axios.post('http://localhost:3000/users',userdata)
return response.data
}
    const mutation=useMutation(createUser,{
        onSuccess: () => {
            toast.success('created successfully!')
        },
        onError: (error:any) => {
         toast.error('Error creating user',error)
        }
      });
  return (
    <div className="login-page">
        
    <form  onSubmit={handleSubmit(onSubmit)} className="login-form">
        <h1 style={{color:'orange'}}>SIGNUP </h1>
        <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input type="text" id="firstName" {...register('firstName',{required:{
                value:true,
                message:'First Name is required'
            },pattern:{
                value:/^[A-Za-z]+$/i ,
                message:'invalid'
            }})} />
            <p className="error">{errors.firstName?.message}</p>
            
        </div>
        <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input type="text" id="lastName" {...register('lastName',{required:{
                value:true,
                message:'Last Name is required'
            },pattern:{
                value:/^[A-Za-z]+$/i ,
                message:'invalid'
            }})} />
            <p className="error"> {errors.lastName?.message}</p>
           
        </div>
        <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input 
  type="text" 
  id="phoneNumber" 
  {...register('phoneNumber', {
    required: {
      value: true,
      message: 'Phone Number is required'
    },
    pattern: {
      value: /^\d{10}$/, 
      message: 'Please enter a valid 10-digit phone number',
    }
  })} 
/>
<p className="error">{errors.phoneNumber?.message}</p>
           
        </div>
        <div className="form-group">
            <label htmlFor="email">Email</label>
            <input type="text" id="email" {...register('email',{required:{
                value:true,
                message:'Email is required'
            },pattern: {
                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                message: 'Please enter a valid email address.',
              }})} />
              <p className="error">{errors.email?.message}</p>
            
        </div>
        <div className="form-group">
            <label htmlFor="Password">Password</label>
            <input type="password" id="Password" {...register('Password',{required:{
                value:true,
                message:'password is required'
            },minLength: {
                value: 8,
                message: "Password must have at least 8 characters"
              }})} />
              <p className="error">  {errors.Password?.message}</p>
          
        </div>
        <div className="form-group">
            <label htmlFor="ConfirmPassword">Confirm Password</label>
            <input
                type="password"
                {...register("ConfirmPassword", {
                    required: "Confirm password is required",
                    validate: value => value === Password || "The passwords do not match"
                })}
            />
           <p className="error"> {errors.ConfirmPassword && errors.ConfirmPassword.message}</p>
        </div>
        <button type="submit" className="button">Submit</button>
        <ToastContainer />
    </form>
    </div>
  )
}

export default SignupPage