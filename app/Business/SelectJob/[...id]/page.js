"use client"
import React from 'react'
import SelectedJob from '@/Components/SelectedJob/SelectedJob'
import { QueryClientProvider, QueryClient } from 'react-query'

const queryClient = new QueryClient

function Job({params}) {
  return (
    
       <QueryClientProvider client={queryClient}>
         <SelectedJob params={params}/>
       </QueryClientProvider>
    
  )
}

export default Job