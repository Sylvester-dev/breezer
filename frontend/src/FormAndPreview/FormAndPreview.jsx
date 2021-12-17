import React, { Component,useState } from "react";
import Data from "../data_json.json";
import CryptoBoyNFTImage from "../CryptoBoyNFTImage/CryptoBoyNFTImage";



function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function getRandomValue() {
  const rand = Math.floor(Math.random() * 499);
  return rand;
}

class FormAndPreview extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      userSelectedColors: [
        {
          
        },
      ],
      cryptoBoyName: "",
      cryptoBoyPrice: "",
    };
  }

  componentDidMount = async () => {
    await this.props.setMintBtnTimer();
  };

  callMintMyNFTFromApp = (e) => {
    e.preventDefault();
    this.props.mintMyNFT(
      
      this.state.cryptoBoyName,
      this.state.cryptoBoyPrice
    );
  };

 

  render() {
    // let url = "https://ipfs.io/ipfs/"+this.props.image;
    return (
      <div>
        <div className="card mt-1">
          <div className="card-body align-items-center d-flex justify-content-center">
            <h5>
              Mint Your Farm Article With True Rating Using IOT based True
              Ratings
            </h5>
          </div>
        </div>
        <form onSubmit={this.callMintMyNFTFromApp} className="pt-4 mt-1">
          <div className="row">
            <div className="col-md-6">
            <h1 style={{ fontSize: "small"}}>Fetching data from device...</h1>
            <h1 style={{ fontSize: "inherit"}}>Latitude: {Data[getRandomValue()].latitude}</h1>
            <h1 style={{ fontSize: "inherit"}}>Longitude: {Data[getRandomValue()].longitude}</h1>
            <h1 style={{ fontSize: "inherit"}}>Climate Temperature: {Data[getRandomValue()].temperature}</h1>
            <h1 style={{ fontSize: "inherit"}}>Pressure: {Data[getRandomValue()].pressure}</h1>
            <h1 style={{ fontSize: "inherit"}}>Humidity in air: {Data[getRandomValue()].humidity}</h1>
            <h1 style={{ fontSize: "inherit"}}>Light intensity: {Data[getRandomValue()].light}</h1>
            </div>
            
            <div className="col-md-6 d-flex justify-content-center align-items-center">
              {/* Select image component */}
              <img src="https://tse4.mm.bing.net/th?id=OIP.4e1OgmuDE5oxtBXkAgo7wQHaHL&pid=Api&P=0&w=300&h=300"></img>
            </div>
          </div>
          <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-3"></div>
            <div className="col-md-6">
              <div className="form-group">
                <label htmlFor="cryptoBoyName">Name</label>
                <input
                  required
                  type="text"
                  value={this.state.cryptoBoyName}
                  className="form-control"
                  placeholder="Enter Your Article's Name"
                  onChange={(e) =>
                    this.setState({ cryptoBoyName: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="price">Price</label>
                <input
                  required
                  type="number"
                  name="price"
                  id="cryptoBoyPrice"
                  value={this.state.cryptoBoyPrice}
                  className="form-control"
                  placeholder="Enter Price In Ξ"
                  onChange={(e) =>
                    this.setState({ cryptoBoyPrice: e.target.value })
                  }
                />
              </div>
              <button
                id="mintBtn"
                style={{ fontSize: "0.9rem", letterSpacing: "0.14rem" }}
                type="submit"
                className="btn mt-4 btn-block btn-outline-primary"
              >
                Mint My Farm Article
              </button>
              <div className="mt-4">
                {this.props.nameIsUsed ? (
                  <div className="alert alert-danger alert-dissmissible">
                    <button
                      type="button"
                      className="close"
                      data-dismiss="alert"
                    >
                      <span>&times;</span>
                    </button>
                    <strong>This name is taken!</strong>
                  </div>
                ) : this.props.colorIsUsed ? (
                  <>
                    <div className="alert alert-danger alert-dissmissible">
                      <button
                        type="button"
                        className="close"
                        data-dismiss="alert"
                      >
                        <span>&times;</span>
                      </button>
                      {this.props.colorsUsed.length > 1 ? (
                        <strong>These colors are taken!</strong>
                      ) : (
                        <strong>This color is taken!</strong>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        marginTop: "1rem",
                        marginBottom: "3rem",
                      }}
                    >
                      {this.props.colorsUsed.map((color, index) => (
                        <div
                          key={index}
                          style={{
                            background: `${color}`,
                            width: "50%",
                            height: "50px",
                          }}
                        ></div>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default FormAndPreview;
