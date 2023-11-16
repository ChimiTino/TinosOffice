import React from 'react'
import pb from '../lib/pocketbase'
import { useQuery, useMutation } from 'react-query'

function GetMessages() {
    const id = pb.authStore.model?.id;

    async function GettheMessages(){
        const records = await pb.collection('notes').getFullList({
            sort: 'created',

        });
        return records;
     }
     return  useQuery({ queryFn: GettheMessages, queryKey:['GettheMessages', 'bubuhbh87h9h08h0']})
}

export default GetMessages