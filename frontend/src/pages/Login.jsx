import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getData } from '@/context/userContext'
import Google from "../assets/googleLogo.png"

const Login = () => {
    const { setUser } = getData()
    const navigate = useNavigate()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            setIsLoading(true)
            // <<< UPDATED THIS LINE
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/user/login`, formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (res.data.success) {
                navigate('/')
                setUser(res.data.user)
                localStorage.setItem("accessToken", res.data.accessToken)
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setIsLoading(false)
        }
    }

    // Function to handle Google Login
    const handleGoogleLogin = () => {
        // The full URL for Google auth on your deployed backend
        const googleAuthUrl = `${import.meta.env.VITE_API_URL}/auth/google`;
        window.open(googleAuthUrl, "_self");
    }
    
    return (
        <div className='relative w-full h-screen md:h-[760px] bg-green-100 overflow-hidden'>
            <div className='min-h-screen flex flex-col to-muted/20'>
                <div className='flex-1 flex items-center justify-center p-4'>
                    <div className='w-full max-w-md space-y-6 flex flex-col items-center'>
                        <div className='text-center space-y-2'>
                            <h1 className='text-3xl font-bold tracking-tight text-green-600'>Login into your account</h1>
                            <p className='text-gray-600'>Start organizing your thoughts and ideas today</p>
                        </div>
                        <Card className="w-full max-w-sm">
                            <CardHeader className='space-y-1'>
                                <CardTitle className='text-2xl text-center text-green-600'>Login</CardTitle>
                                <CardDescription className='text-center'>
                                    Login into your account to get started with Notes App
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="m@example.com"
                                            required
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <div className='flex items-center justify-between'>
                                            <Label htmlFor="password">Password</Label>
                                            <Link className='text-sm' to={'/forgot-password'}>Forgot your password?</Link>
                                        </div>
                                        <div className='relative'>
                                            <Input
                                                id="password"
                                                name="password"
                                                placeholder="Enter your password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                type={showPassword ? "text" : "password"}
                                                required
                                            />
                                            <Button
                                                variant='ghost'
                                                size="sm"
                                                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={isLoading}
                                            >
                                                {
                                                    showPassword ? <EyeOff className="w-4 h-4 text-gray-600" /> : <Eye className="w-4 h-4 text-gray-600" />
                                                }
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex-col gap-2">
                                <Button onClick={handleSubmit} type="submit" className="w-full bg-green-600 hover:bg-green-500">
                                    {
                                        isLoading ? (
                                            <>
                                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                Logging into your account..
                                            </>
                                        ) : "Login"
                                    }
                                </Button>
                                {/* <<< UPDATED THIS LINE */}
                                <Button onClick={handleGoogleLogin} className='w-full' variant='outline'>
                                    <img src={Google} alt="" className='w-5'/>
                                    Login with Google
                                </Button>
                                <div className="mt-4 text-center text-sm">
                                    Don't have an account?{" "}
                                    <Link to="/signup" className="underline text-green-600 hover:text-green-500">
                                        Sign Up
                                    </Link>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login