import React, { useEffect, useState } from "react";
import { abi, contractAddress } from "../Constants";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { ethers } from "ethers";
import Table from "./Table";
import { useNotification } from "web3uikit";
import axios from "axios";
const Web3Caller = () => {
  const defaultAddress = "0x0000000000000000000000000000000000000000";
  const { chainId: chainIdHex, account, isWeb3Enabled } = useMoralis();
  const mineth = ethers.utils.parseEther("0.001")
  const [username, setUsername] = useState("");
  const [contract, setContractAddress] = useState(defaultAddress);
  const chainId = parseInt(chainIdHex);
  const ContractAddress =
    chainId in contractAddress ? contractAddress[chainId][0] : null
  const dispatch = useNotification();
  const {
    runContractFunction: deployFundMe,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: ContractAddress,
    functionName: "deployFundMe",
    params: {
      mineth: mineth,
    },
  });
  const { runContractFunction: getContracts } = useWeb3Contract({
    abi: abi,
    contractAddress: ContractAddress,
    functionName: "getContracts",
    params: {
      _addr: account,
    },
  });

  async function updateFrontend(){
    setContractAddress(contractAddr)
    pushDatabase()
    handleNotification("Transaction Completed");
  }
let contractAddr
  async function handleSuccess(tx) {
    await tx.wait(1);
    contractAddr = await getContracts({
      onSuccess:updateFrontend
    })
  }
  function handleNotification(message) {
    dispatch({
      type: "info",
      message: `${message}`,
      title: "Tx Notification",
      position: "topR",
    });
  }
  async function handleError(error) {
    dispatch({
      type: "error",
      message: error,
    });
  }
  const pushDatabase = async() =>{
    await axios.post("http://localhost:4004/postdata",{
      "deployer":account,
      "chainId":chainId,
      "name":username
    })
    handleNotification("Database Updated!")
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      await deployFundMe({
        onSuccess: handleSuccess,
        onError: (error) => handleError(error)
      });
    }
    catch(error){}
  };
  const changeHandlerUsername = (e) => {
    setUsername(e.target.value);
  };
  async function handleTask() {
    let dataContract;
    try {
      dataContract = await getContracts();
    } catch (error) {}
    setContractAddress(dataContract);
  }
  useEffect(() => {
    handleTask();
  }, [isWeb3Enabled, account]);
  return (
    <div>
      {contract === defaultAddress ? (
        <>
          <form className="container" onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Username
              </label>
              <input
                type="username"
                value={username}
                onChange={changeHandlerUsername}
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading || isFetching}
            >
              Submit
            </button>
          </form>
          <Table chainId={chainId}/>
        </>
      ) : (
        <>
        <div className="container">
          You Have Already Deployed Your Identity By {account}
        <Table chainId={chainId}/>
          </div>
        </>
      )}
    </div>
  );
};

export default Web3Caller;
