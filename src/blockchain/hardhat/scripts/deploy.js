const fs = require('fs');
const { ethers } = require('hardhat');

async function main() {

    const PensionContract = await ethers.getContractFactory("Pension");
    const pension = await PensionContract.deploy();
    await pension.deployed();
    console.log("The Pension Contract was deployed to: " + pension.address);
    console.log("The Pension Contract was deployein to block number: " + await pension.provider.getBlockNumber());

    //Create the environment file with the start contract addresses.
    let addresses = {
        "pensioncontract": pension.address, 
        "blocknumberr": await pension.provider.getBlockNumber()
    }
    let addressesJSON = JSON.stringify(addresses);
    fs.writeFileSync("src/blockchain/environment/contract-address.json", addressesJSON);
}

main()
.then(() => {
    process.exit(0);
})
.catch((error) => {
    console.error(error);
    process.exit(1);
})