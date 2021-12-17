import React, { useState, useEffect } from "react";
import CryptoBoyNFTImage from "../CryptoBoyNFTImage/CryptoBoyNFTImage";
import MedicalNFTDetails from "../MedicalNFTDetails/MedicalNFTDetails";
import Loading from "../Loading/Loading";
import Axios from "axios";

const AllMedicals = ({
  cryptoBoys,
  accountAddress,
  totalTokensMinted,
  changeTokenPrice,
  toggleForSale,
  buyCrop,
  medicalUsers,
}) => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  

  useEffect(() => {
    if (medicalUsers.length !== 0) {
      if (medicalUsers[0].metaData !== undefined) {
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [medicalUsers]);

  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            Total No. of Breeze's Med Minted On The Platform :{" "}
            {medicalUsers.length}
          </h5>
        </div>
      </div>
      <div className="d-flex flex-wrap mb-2">
      {/* {users.map((user) => { */}
    {/* let datas = user.api;
    console.log(datas); */}
    {/* return(
      <div>
        <h1>Longitude: {user.lat}</h1>
      </div> 
    );
})} */}
        {medicalUsers.map((user) => {
          return (
            <div
              className="w-50 p-4 mt-1 border"
            >
              {/* {!loading ? (
                <CryptoBoyNFTImage
                  colors={
                    cryptoboy.metaData !== undefined
                      ? cryptoboy.metaData.metaData.colors
                      : ""
                  }
                />
              ) : (
                <Loading />
              )} */}
              <MedicalNFTDetails
                lat={user.lat}
                lon={user.lon}
                price={user.price}
                humidity={user.humidity}
                assetName={user.assetName}
                image={user.image}
                light={user.light}
                pressure={user.pressure}
                rating={user.rating}
                temperature={user.temperature}
                tokenId={user.token}
                distance={user.distance}
                timestamp={user.timestamp}
                link={user.link}
                buyCrop={buyCrop}
                
              />
            </div>
          );
        })} 
      </div>
    </div>
  );
};

export default AllMedicals;
