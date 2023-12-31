"use client"
import Home from '@/Components/Home/Home'
import React from 'react'
import { QueryClientProvider, QueryClient } from 'react-query'

const queryClient = new QueryClient

function page() {
  return (
    <>
    <QueryClientProvider client={queryClient}>
      <Home/>
    </QueryClientProvider>
      
    </>
  )
}

export default page