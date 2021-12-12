"use strict";

require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");

require("@nomiclabs/hardhat-waffle");

require("hardhat-gas-reporter");

require("solidity-coverage"); // This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html


task("accounts", "Prints the list of accounts", function _callee(taskArgs, hre) {
  var accounts, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, account;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(hre.ethers.getSigners());

        case 2:
          accounts = _context.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context.prev = 6;

          for (_iterator = accounts[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            account = _step.value;
            console.log(account.address);
          }

          _context.next = 14;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](6);
          _didIteratorError = true;
          _iteratorError = _context.t0;

        case 14:
          _context.prev = 14;
          _context.prev = 15;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 17:
          _context.prev = 17;

          if (!_didIteratorError) {
            _context.next = 20;
            break;
          }

          throw _iteratorError;

        case 20:
          return _context.finish(17);

        case 21:
          return _context.finish(14);

        case 22:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 10, 14, 22], [15,, 17, 21]]);
}); // You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

module.exports = {
  solidity: "0.8.4",
  networks: {
    iotex: {
      url: "https://babel-api.testnet.iotex.io",
      accounts: ["009bf2ef3f42055f981f34495986de463cede4fdc0e925d5ca2afc001aacd20f"],
      chainId: 4690,
      gas: 8500000,
      gasPrice: 1000000000000
    }
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD"
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};