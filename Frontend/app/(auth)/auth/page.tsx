"use client";

import React, { useState } from 'react';
import { Lock, Eye, EyeOff} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { userLogin } from '@/lib/api_handler';
import { useRouter } from 'next/navigation';
import GoogleLogin from '@/components/GoogleLogin';


// Input Component
const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  label, 
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  icon
}:{
  type?: string,
  placeholder?: string,
  value?: string,
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
  label?: string,
  showPasswordToggle?: boolean,
  showPassword?: boolean,
  onTogglePassword?: () => void,
  icon?: React.ReactNode
}) => {
  return (
    <div className="mb-6">
      <label className="block text-gray-800 text-lg font-semibold mb-3">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={showPasswordToggle ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-4 ${icon ? 'pl-12' : ''} ${showPasswordToggle ? 'pr-12' : ''} 
                     bg-white border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 
                     focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent 
                     transition-all duration-200`}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

// Button Component
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  className = ''
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'link';
  className?: string;
}) => {

  const baseClasses = "w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200";
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
    link: "text-green-600 hover:text-green-700 hover:underline"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};


// Login Form Component
const LoginForm = ({
  type = 'login',
  onToggleType
}: {
  type?: 'login' | 'sign-up';
  onToggleType: () => void;
}) => {

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleInputChange = (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {  
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const { mutate: loginMutation } = useMutation({
    mutationFn: userLogin,
    onSuccess(data) {
      console.log(data.message);
      toast.success("Login successful!");
      router.push("/dashboard");
    },
    onError(error) {
      toast.error("Login failed!" + error);
    }
  });

  const { mutate:signupMutation } = useMutation({
    mutationFn: userLogin,
    onSuccess(data) {
      console.log(data);
      toast.success("Sign Up successful!");
      router.push("/dashboard");
    },
    onError(error) {
      toast.error("Sign Up failed!" + error);
    },
   
  
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (type === 'sign-up') {
      // TODO: implement sign-up logic or call userSignup
      signupMutation(formData);
      console.log('SignUp submitted:', formData);
    } else {
      loginMutation(formData);
      console.log('Login submitted:', formData);
    }
  };

  const isSignUp = type === 'sign-up';

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md mx-auto">
      <div>
        {isSignUp && (
          <Input
            type="text"
            label="Name"
            value={formData.name}
            onChange={handleInputChange('name')}
            placeholder="Enter your full name"
            onTogglePassword={() => {}}
            icon={undefined}
          />
        )}
        
        <Input
          type="email"
          label="Email"
          value={formData.email}
          onChange={handleInputChange('email')}
          placeholder="Enter your email"
          onTogglePassword={() => {}}
            icon={undefined}
        />
        
        <Input
          label="Password"
          value={formData.password}
          onChange={handleInputChange('password')}
          placeholder="Enter your password"
          icon={<Lock size={20} />}
          showPasswordToggle={true}
          showPassword={showPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
        />
        
        {!isSignUp && (
          <div className="text-right mb-6">
            <button className="text-gray-600 hover:text-green-600 transition-colors">
              Forgot password?
            </button>
          </div>
        )}
        
        <Button onClick={handleSubmit} className="mb-6">
          {isSignUp ? 'Sign up' : 'Log in'}
        </Button>
        
        <div className="text-center">
          <span className="text-gray-600">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          </span>
          <button 
            className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors no-underline" 
            onClick={onToggleType}
          >
            {isSignUp ? 'Log in' : 'Sign up'}
          </button>
          <br />
          <span className='text-gray-600 m-10'>or</span>
          <br />
          {/* <h5 className="text-gray-600 mb-4">Sign in with Google</h5> */}
          <GoogleLogin/>
          <br />
          <Link href="/" className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors no-underline"  >
          Go Back Home
          </Link>
        </div>
      </div>
    </div>
  );
};

// Main Login Page Component
const LoginPage = () => {
  const [currentType, setCurrentType] = useState<'sign-up' | 'login'>('sign-up');

  
  const handleToggleType = () => {
    setCurrentType(currentType === 'sign-up' ? 'login' : 'sign-up');
  };

  const isSignUp = currentType === 'sign-up';

  
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-100 rounded-full opacity-50"></div>
        <div className="absolute bottom-20 left-40 w-24 h-24 bg-blue-100 rounded-full opacity-50"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-green-200 rounded-full opacity-50"></div>
        <div className="absolute bottom-40 right-40 w-28 h-28 bg-blue-200 rounded-full opacity-50"></div>
      </div>
      
      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {isSignUp ? 'Create your account' : 'Log in to your account'}
          </h1>
          <p className="text-gray-600 text-lg">
            {isSignUp 
              ? 'Enter your details to create a new account.' 
              : 'Enter your account details to continue.'
            }
          </p>
        
        </div>
        
        <LoginForm type={currentType} onToggleType={handleToggleType} />
      </div>
      
    </div>
  );
};

export default LoginPage;
