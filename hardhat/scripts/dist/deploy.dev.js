"use strict";

var hre = require("hardhat");

function main() {
  var CropNFT, cropNFT, Market, market;
  return regeneratorRuntime.async(function main$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(hre.ethers.getContractFactory("CropNFT"));

        case 2:
          CropNFT = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(CropNFT.deploy());

        case 5:
          cropNFT = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(cropNFT.deployed());

        case 8:
          console.log("the address for nft contract is: " + cropNFT.address);
          _context.next = 11;
          return regeneratorRuntime.awrap(hre.ethers.getContractFactory("Market"));

        case 11:
          Market = _context.sent;
          _context.next = 14;
          return regeneratorRuntime.awrap(Market.deploy());

        case 14:
          market = _context.sent;
          _context.next = 17;
          return regeneratorRuntime.awrap(market.deployed());

        case 17:
          // console.log("MemeNFT deployed to:", memeNFT.address);
          console.log("Market deployed to:", market.address);

        case 18:
        case "end":
          return _context.stop();
      }
    }
  });
} // We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.


main().then(function () {
  return process.exit(0);
})["catch"](function (error) {
  console.error(error);
  process.exit(1);
});