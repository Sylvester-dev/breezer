import React, { useState, useEffect } from "react";
import CryptoBoyNFTImage from "../CryptoBoyNFTImage/CryptoBoyNFTImage";
import MyCryptoBoyNFTDetails from "../MyCryptoBoyNFTDetails/MyCryptoBoyNFTDetails";
import Loading from "../Loading/Loading";
import Data from "../data_json.json";

const MyCryptoBoys = ({
  accountAddress,
  cryptoBoys,
  totalTokensOwnedByAccount,
}) => {
  const [loading, setLoading] = useState(false);
  const [myCryptoBoys, setMyCryptoBoys] = useState([]);

  useEffect(() => {
    if (cryptoBoys.length !== 0) {
      if (cryptoBoys[0].metaData !== undefined) {
        setLoading(loading);
      } else {
        setLoading(false);
      }
    }
    const my_crypto_boys = cryptoBoys.filter(
      (cryptoboy) => cryptoboy.currentOwner === accountAddress
    );
    setMyCryptoBoys(my_crypto_boys);
  }, [cryptoBoys]);

  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            Look at others Farm Article
          </h5>
        </div>
      </div>
      <div className="d-flex flex-wrap mb-2">
        {Data.map((d) => {
          return (
            
            <div className="mt-4 ml-4 mr-4 mb-4">
         <img src="https://tse2.mm.bing.net/th?id=OIP.U88J_cJjZbfpEGjWI3si7QHaEK&pid=Api&P=0&w=275&h=155" class="img-fluid" alt="Responsive image"></img>
     
        <p>
          <span className="font-weight-bold">Latitude</span> :{" "}
          {d.latitude}
        </p>
        <p>
          <span className="font-weight-bold">Longitude</span> :{" "}
          {d.longitude}
        </p>
        <p>
          <span className="font-weight-bold">Temperature</span> :{" "}
          {d.temperature}
        </p>
        <p>
          <span className="font-weight-bold">Price</span> :{" "}
          {d.random}{" "} Ξ
        </p> 
        <p>
          <span className="font-weight-bold">Humidity</span> :{" "}
          {d.humidity}
        </p>
        <p>
          <span className="font-weight-bold">Light</span> :{" "}
          {d.light}
        </p>
        <p>
          <span className="font-weight-bold">Pressure</span> :{" "}
          {d.pressure}
        </p>
        <p>
          <span className="font-weight-bold">Birth Timestamp</span> :{" "}
          {d.timestamp}
        </p>
        <p>
          <span className="font-weight-bold">Rating</span> :{" "}
          {d.temperature2}
        </p>
        </div>
            
          );
        })}
      </div>
    </div>
  );
};

export default MyCryptoBoys;




{/* <div className="mt-4">
         <img src="https://tse2.mm.bing.net/th?id=OIP.U88J_cJjZbfpEGjWI3si7QHaEK&pid=Api&P=0&w=275&h=155" class="img-fluid" alt="Responsive image"></img>
     
        <p>
          <span className="font-weight-bold">Latitude</span> :{" "}
          {d.latitude}
        </p>
        <p>
          <span className="font-weight-bold">Longitude</span> :{" "}
          {d.longitude}
        </p>
        <p>
          <span className="font-weight-bold">Temperature</span> :{" "}
          {d.temperature}
        </p>
        <p>
          <span className="font-weight-bold">Price</span> :{" "}
          {d.random}{" "} Ξ
        </p> 
        <p>
          <span className="font-weight-bold">Humidity</span> :{" "}
          {d.humidity}
        </p>
        <p>
          <span className="font-weight-bold">Light</span> :{" "}
          {d.light}
        </p>
        <p>
          <span className="font-weight-bold">Pressure</span> :{" "}
          {d.pressure}
        </p>
        <p>
          <span className="font-weight-bold">Birth Timestamp</span> :{" "}
          {d.timestamp}
        </p>
        <p>
          <span className="font-weight-bold">Rating</span> :{" "}
          {d.temperature2}
        </p>
        </div> */}