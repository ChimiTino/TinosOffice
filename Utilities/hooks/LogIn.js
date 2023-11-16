"use client"; 
import pb from "../lib/pocketbase";
import { useState } from "react";
import { useMutation } from "react-query";
import { useQuery } from "react-query";

function LogIn() {

    async function login({
        username,
         password
        }){
        const authData = await pb
        .collection("users")
        .authWithPassword(
            username,
            password
            
            );       
    }
    
    return  useMutation(login)
    //mutation helps with loading state ,error and more go check there docs
}

export default LogIn