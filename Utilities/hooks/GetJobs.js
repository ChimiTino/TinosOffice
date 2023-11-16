import React, {useMemo} from 'react'
import pb from '../lib/pocketbase';
import { useQuery, useMutation } from 'react-query'

export default function GetJobs() {
    const id = pb.authStore.model?.id;

    async function GettheJobs(){
        const recordsjobs = await pb.collection('jobs').getFullList({
            sort: '-created',
 

        });
        return recordsjobs;
     }
     return  useQuery({ queryFn: GettheJobs, queryKey:['GettheJobs', id]})
}

