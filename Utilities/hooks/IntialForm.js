import React from 'react'
import pb from '../lib/pocketbase'
import { useMutation } from 'react-query'


export default function IntialForm() {
 async function intialForm({
    client,
    clientnumber,
    address,
    job_description,
    workers_on_job,
    business_number, 
    business,
    claim_provider,
    status,
    proximate_cause,
    excess,

        
}){
    const initialform = await pb.collection("jobs").create({
        client:client,
        clientnumber:clientnumber,
        address:address,
        job_description:job_description,
        workers_on_job:workers_on_job,
        business_number:business_number, 
        business:business,
        claim_provider:claim_provider,
        status:status,
        proximate_cause:proximate_cause,
        excess:excess
         
    })
 }
 return  useMutation(intialForm);
}
