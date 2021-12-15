import React, { useState, useEffect } from "react";
import CryptoBoyNFTImage from "../CryptoBoyNFTImage/CryptoBoyNFTImage";
import CryptoBoyNFTDetails from "../CryptoBoyNFTDetails/CryptoBoyNFTDetails";
import Loading from "../Loading/Loading";
import Axios from "axios";

const AllCryptoBoys = ({
  cryptoBoys,
  accountAddress,
  totalTokensMinted,
  changeTokenPrice,
  toggleForSale,
  buyCrop,
  users,
}) => {
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  

  useEffect(() => {
    if (users.length !== 0) {
      if (users[0].metaData !== undefined) {
        setLoading(loading);
      } else {
        setLoading(false);
      }
    }
  }, [users]);

  return (
    <div>
      <div className="card mt-1">
        <div className="card-body align-items-center d-flex justify-content-center">
          <h5>
            Total No. of Breeze's Minted On The Platform :{" "}
            {users.length}
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
        {users.map((user) => {
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
              <CryptoBoyNFTDetails
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
                buyCrop={buyCrop}
                
              />
            </div>
          );
        })} 
      </div>
    </div>
  );
  // return (
  //   <div>
  //     <div className="card mt-1">
  //       <div className="card-body align-items-center d-flex justify-content-center">
  //         <h5>
  //           Total No. of CryptoBoy's Minted On The Platform :{" "}
  //           {totalTokensMinted}
  //         </h5>
  //       </div>
  //     </div>
  //     <div className="d-flex flex-wrap mb-2">
  //       {cryptoBoys.map((cryptoboy) => {
  //         return (
  //           <div
  //             key={cryptoboy.tokenId.toNumber()}
  //             className="w-50 p-4 mt-1 border"
  //           >
  //             {!loading ? (
  //               <CryptoBoyNFTImage
  //                 colors={
  //                   cryptoboy.metaData !== undefined
  //                     ? cryptoboy.metaData.metaData.colors
  //                     : ""
  //                 }
  //               />
  //             ) : (
  //               <Loading />
  //             )}
  //             <CryptoBoyNFTDetails
  //               cryptoboy={cryptoboy}
  //               accountAddress={accountAddress}
  //               changeTokenPrice={changeTokenPrice}
  //               toggleForSale={toggleForSale}
  //               buyCryptoBoy={buyCryptoBoy}
  //             />
  //           </div>
  //         );
  //       })}
  //     </div>
  //   </div>
  // );
};

export default AllCryptoBoys;
