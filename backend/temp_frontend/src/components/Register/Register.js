import React from 'react'
import {useRef, useState, useEffect } from "react";
import axios from "../../api/Axios"
import { Link } from "react-router-dom";
const REGISTER_URL = '/register';

const Register = () => {

    const [user, setUser] = useState('');
    const [email, setEmail] = useState('');
    const [pwd, setPwd] = useState('');
    //const [matchPwd, setMatchPwd] = useState('');

    const userRef = useRef();
    const errRef = useRef();

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setErrMsg('');
    }, [user,email, pwd])

   const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ user, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            console.log(response?.data);
            console.log(response?.accessToken);
            console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            //need value attrib on inputs for this
            setUser('');
            setEmail('');
            setPwd('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }
    

  return (
    <>
    {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
                <div className='flex flex-col w-full h-full justify-center items-center gap-4'>
                    {/*<p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>*/}
                    <div className="flex justify-center items-center h-[10%] ">
          <h1 className="font-semibold md:font-bold text-4xl ">Register</h1>
        </div>
                    <form onSubmit={handleSubmit}
                    className="flex items-center justify-center flex-col w-full h-[50%] gap-8"
                    >
                      
                        <input
                            type="text"
                            id="username"
                            placeholder='Enter username'
                            ref={userRef}
                            autoComplete="off"
                            onChange={(e) => setUser(e.target.value)}
                            value={user}
                            required
                            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
                        />
                       
                        <input
                            type="email"
                            id="email"
                            placeholder='Enter email'
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
                        />


                        <input
                            type="password"
                            id="password"
                            placeholder='Enter password'
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            className="flex rounded-3xl h-[20%] w-[50%] text-start px-4 border-2"
                        />
                    
                    <button className="flex text-xl font-medium bg-black text-white py-2 px-8 rounded-3xl items-center justify-center hover:bg-[#27272a]">Register</button>
                    </form>
                    <p className="font-normal px-2 text-sm">
                        Already registered?
                        
                    <Link to="/login" className="text-blue-600 text-base"> Login</Link>
                        
                    </p>
                    </div>
            
            
            )}
            </>
  )
    }
            

            
export default Register