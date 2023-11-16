import React from 'react'
import pb from '../lib/pocketbase'
import { useQuery, useMutation } from 'react-query'

function GetWorker() {
    const id = pb.authStore.model?.id;

    async function GettheWorker(){
        const records = await pb.collection('workers').getFullList({
            sort: '-number_of_jobs',
        });
        return records;
     }
     return  useQuery({ queryFn: GettheWorker, queryKey:['GettheWorker', id]})
}

export default GetWorker