/* eslint-disable @next/next/no-img-element */
"use client"
import React, { useState, useEffect } from 'react'
import pb from '@/Utilities/lib/pocketbase';
import Link from 'next/link';
import style from '../../app/home.module.css'
import stylesclaims from '../../app/sidebar.module.css'


function SHome({logout}) {
    const [business, setBusiness] = useState([])

async function Businesses(){
    const records = await pb.collection('business').getFullList({
        sort: '-created',
    });
    setBusiness(records)
}

useEffect(()=>{
 Businesses()
},[])
    
  return (
    <div className={style.background}>

    
    <div  
    // style={{backgroundImage:'url()'}}
    >
         <div className={style.container}>
    <h4 className={style.welcomeh4}> Welcome back</h4>
    <h2 className={style.welcomeh2}>
     {pb.authStore.model.name}
     </h2>
        <div className={style.bussiList}>
        {business.map((items, index)=>{
            return(
        <div key={index} className={style.business}>
        <Link href={`/Business/${items.htmlname}`} >
        <div className={stylesclaims.jopbBussiness1}>
        <img className={stylesclaims.formimgs} src={`https://panicky-lion.pockethost.io//api/files/${items.collectionId}/${items.id}/${items.icon}?token=`} alt='' />
        <h3  className={stylesclaims.akxkx}>  
          {items.name}</h3>
          </div>
       </Link>
        </div> 
            )
        })}</div>
    <button className={style.logout} onClick={logout}>Log Out</button>
    </div>
    </div></div>
   
  )
}

export default SHome