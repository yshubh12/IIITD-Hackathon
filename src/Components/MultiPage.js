import React, { useEffect, useState } from 'react'
import FundMe from './FundMe'
import { useParams } from 'react-router-dom'
import axios from 'axios'


const MultiPage = () => {
    const {addr} = useParams()    
    const [contract,setContract ] = useState(null)

    /* Currently Using Deployer Address, some bugs are faced as per contract Address */
    useEffect(()=>{
        async function getData(){
            const data = await axios.get("http://localhost:4004/postdata/"+addr)
            setContract(data["data"]["task"]["deployer"])
        }
        getData()
    })
  return (
    <>
    {
      contract && (
    <div>
      <FundMe deployerAddress={contract}/>
    </div>
      )  
    }
    </>
  )
}

export default MultiPage
