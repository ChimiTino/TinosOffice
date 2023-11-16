import React from 'react'
import pb from '../lib/pocketbase';
import { useMutation } from 'react-query'

function SendMessage() {
 async function send({
    users_name,
    job,
    message,

}){
const initialform = await pb.collection("notes").create({
    users_name:users_name,
    job:job,
    message:message,
    
})
}
return  useMutation(send);
}

export default SendMessage