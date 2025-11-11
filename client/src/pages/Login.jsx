import { LockIcon, Mail, User2Icon } from 'lucide-react';
import React from 'react'
import api from '../configs/api.js';
import { useDispatch } from 'react-redux';
import { login } from '../app/features/authSlice.js';
import toast from 'react-hot-toast';
const Login = () => {
    const dispatch = useDispatch();
    const query = new URLSearchParams(window.location.search)
    const urlState = query.get('state')
    const [state, setState] = React.useState(urlState || "login");

    // state for input value
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        password: "",
    });

    // handle change input value
    const onChangeHandler = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // handle submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/api/users/${state}`, formData);
            const data = res.data;

            if (data?.token) {
                dispatch(login(data));
                localStorage.setItem('token', data.token);
                toast.success(data.message || "Success!");
            }} catch (error) {
                toast.error(error?.response?.data?.message || error.message);
            }


        };

        return (
            <div className='flex items-center justify-center min-h-screen bg-green-200'>
                <form
                    onSubmit={handleSubmit}
                    className="w-full sm:w-[350px] text-center border border-zinc-300/60 dark:border-zinc-700 rounded-2xl px-8 bg-white dark:bg-white"
                >
                    <h1 className="text-zinc-900 dark:text-green-600 text-3xl mt-10 font-medium">
                        {state === "login" ? "Login" : "Register"}
                    </h1>
                    <p className="text-zinc-500 dark:text-green-800 text-sm mt-2 pb-6">
                        Please {state === "login" ? "sign in" : "sign up"} to continue
                    </p>

                    {state !== "login" && (
                        <div className="flex items-center w-full mt-4 bg-white dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
                            {/* User Icon */}
                            <User2Icon size={16} color='#6B7280' />
                            <input type="text" placeholder="Name" className="bg-transparent text-zinc-600 dark:text-zinc-200 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none text-sm w-full h-full" name="name" value={formData.name} onChange={onChangeHandler} required />
                        </div>
                    )}

                    <div className="flex items-center w-full mt-4 bg-white dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        {/* Mail Icon */}
                        <Mail size={13} color='#6B7280' />
                        <input type="email" placeholder="Email id" className="bg-transparent text-zinc-600 dark:text-zinc-200 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none text-sm w-full h-full" name="email" value={formData.email} onChange={onChangeHandler} required />
                    </div>

                    <div className="flex items-center mt-4 w-full bg-white dark:bg-zinc-800 border border-zinc-300/80 dark:border-zinc-700 h-12 rounded-full overflow-hidden pl-6 gap-2">
                        {/* Lock Icon */}
                        <LockIcon size={13} color='#6B7280' />
                        <input type="password" placeholder="Password" className="bg-transparent text-zinc-600 dark:text-zinc-200 placeholder-zinc-500 dark:placeholder-zinc-400 outline-none text-sm w-full h-full" name="password" value={formData.password} onChange={onChangeHandler} required />
                    </div>

                    <div className="mt-5 text-left">
                        <a className="text-sm text-indigo-500 dark:text-green-600 justify-center flex items-center mb-4" href="#" >
                            Forgot password?
                        </a>
                    </div>

                    <button type="submit" className="mt-2 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity" >
                        {state === "login" ? "Login" : "Create Account"}
                    </button>

                    <p className="text-white dark:text-green-500 text-sm mt-3 mb-11">
                        {state === "login"
                            ? "Don't have an account? "
                            : "Already have an account? "}
                        <button type="button" className="text-green-800 dark:text-black" onClick={() => setState((prev) => prev === "login" ? "register" : "login")} >
                            {state === "login" ? "Register" : "Login"}
                        </button>
                    </p>
                </form>
            </div>
        )
    }

    export default Login;
