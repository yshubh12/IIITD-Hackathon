import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useMoralis } from "react-moralis";
const Table = () => {
  const [data, setData] = useState([]);
  const {account} = useMoralis()
  const chainId = 11155111
  async function getData() {
    const dbData = await axios.get("http://localhost:4004/postdata/chainId/"+chainId);
    setData(dbData["data"]["tasks"]);
  }
  useEffect(() => {
    getData();
  }, [account]);
  console.log(data)
  return (
    <>
    {
      data && (
        <div className="table-responsive">
      <table class="table container">
        <thead class="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Link</th>
            <th scope="col">Deployer Address</th>
          </tr>
        </thead>
        <tbody>
          {data.map((element, index) => {
            return (
              <div key={element["_id"]}>
                <tr>
                  <th scope="row">{index + 1}</th>
                  <td>{element["name"]}</td>
                  <td>
                    <Link
                      className="btn btn-primary"
                      to={"/contracts/" + element["_id"]}
                      >
                      Go Now
                    </Link>
                  </td>
                      <td>{element["deployer"]}</td>
                </tr>
              </div>
            );
          })}
        </tbody>
      </table>
    </div>
      )  
    }
    </>
      );
};

export default Table;
