/* eslint-disable react-hooks/rules-of-hooks */
"use client"
import React, { useState } from 'react'
import pb from '@/Utilities/lib/pocketbase'
import styles from '../../sidebar.module.css';
import {useForm} from "react-hook-form"
import IntialForm from '@/Utilities/hooks/IntialForm';
import Claims from '@/Components/Claims/Claims';

import { QueryClientProvider, QueryClient } from 'react-query'

const queryClient = new QueryClient


function page({params}) {


  return(
    <>
    <QueryClientProvider client={queryClient}>
        <Claims params={params}/>
    </QueryClientProvider>
    
    </>
  )

}

export default page