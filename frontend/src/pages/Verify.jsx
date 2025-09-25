import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { Loader2, ShieldCheck, ShieldX } from 'lucide-react';

const Verify = () => {
    const { token } = useParams(); // Gets the token from the URL like /verify/your-long-token
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('Verifying your account, please wait...');

    useEffect(() => {
        const verifyToken = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Verification token not found.');
                toast.error('Verification link is invalid or missing.');
                setTimeout(() => navigate('/signup'), 3000);
                return;
            }

            try {
                // <<< CHANGED from .post to .get
                const res = await axios.get(`http://localhost:5000/user/verify/${token}`);

                if (res.data.success) {
                    setStatus('success');
                    setMessage(res.data.message);
                    toast.success(res.data.message);
                    // Redirect to login page after a short delay
                    setTimeout(() => navigate('/login'), 3000);
                }
            } catch (error) {
                const errorMessage = error.response?.data?.message || 'Verification failed. Please try signing up again.';
                setStatus('error');
                setMessage(errorMessage);
                toast.error(errorMessage);
                // Redirect to signup page after a short delay
                setTimeout(() => navigate('/signup'), 3000);
            }
        };

        verifyToken();
    }, [token, navigate]); // This effect runs once when the component loads

    return (
        <div className='flex items-center justify-center min-h-screen bg-green-100'>
            <div className='w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md text-center'>
                {status === 'verifying' && (
                    <div className='flex flex-col items-center gap-4'>
                        <Loader2 className='w-12 h-12 text-green-600 animate-spin' />
                        <h1 className='text-2xl font-bold'>Verifying...</h1>
                    </div>
                )}
                {status === 'success' && (
                    <div className='flex flex-col items-center gap-4'>
                        <ShieldCheck className='w-12 h-12 text-green-600' />
                        <h1 className='text-2xl font-bold'>Verification Successful!</h1>
                    </div>
                )}
                {status === 'error' && (
                    <div className='flex flex-col items-center gap-4'>
                        <ShieldX className='w-12 h-12 text-red-600' />
                        <h1 className='text-2xl font-bold'>Verification Failed</h1>
                    </div>
                )}
                <p className='text-gray-600'>{message}</p>
                <p className='text-sm text-gray-500'>You will be redirected shortly.</p>
            </div>
        </div>
    );
};

export default Verify;