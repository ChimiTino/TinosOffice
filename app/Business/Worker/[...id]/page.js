"use client"
import React from 'react'

import Worker from '@/Components/Worker/Worker'

import { QueryClientProvider, QueryClient } from 'react-query'

const queryClient = new QueryClient


function page({params}) {


  return(
    <>
    <QueryClientProvider client={queryClient}>
        <Worker params={params}/>
    </QueryClientProvider>
    
    </>
  )

}

export default page