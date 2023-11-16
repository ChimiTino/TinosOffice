/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
"use client"; 
import Image from 'next/image'
import pb from '@/Utilities/lib/pocketbase';
import {useForm} from "react-hook-form"
import LogIn from '@/Utilities/hooks/LogIn';
import Logout from '@/Utilities/hooks/LogOut';
import SHome from '../SignedHome/Home';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import style from '../../app/home.module.css'


export default function Home() {
 const [online, setOnline] = useState(null)

 useEffect(()=>
 { 
     setOnline(pb.authStore.isValid) 
     console.log(online);
 }
 ,)
  const {register, handleSubmit, reset} = useForm();
  
  const { mutate: login, isLoading, isError} = LogIn();
  

  const logout = Logout()

  async function onSubmit(data){
    login({username: data.username, password: data.password})
    //error 1 : add {}^
    //error 2 with verification just see the eamil and re copy or sum'n
    reset();
    console.log(data);
    //empties form
    }


  

  return (<>
     { online ?
    <>
    <SHome logout={logout}/>
    </>
    : 
    <html className={style.background}>

    


     <div className={style.container}>
<h4 className={style.welcomeh4}> Welcome back</h4>
<h2 className={style.welcomeh2}> 
{/* {pb.authStore.model.name} */}
</h2>
    <div className={style.bussiList}>
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="name" {... register("username")}/>
      <input type="password" placeholder="password" {... register("password")}/>
    <button className={style.login} type = "submit">Sign In</button>
    </form>
   </div>
   </div>

</html>

    }
  </>
   
  )
}
{/* <div>
<h1>Welcome back</h1>
<form onSubmit={handleSubmit(onSubmit)}>
      <input type="text" placeholder="name" {... register("username")}/>
      <input type="password" placeholder="password" {... register("password")}/>

      <button type = "submit" >Sign In</button>

</form>
</div> */}