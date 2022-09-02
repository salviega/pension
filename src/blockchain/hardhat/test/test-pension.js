const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("Pension Contract", () => {
  const setup = async () => {
    const [owner] = await ethers.getSigners();
    const Pension = await ethers.getContractFactory("Pension")
    const deployed = await Pension.deploy();

    return {
      owner: owner.address,
      deployed
    }
  }

  it("Address Contract", async () => {
    const { deployed } = await setup();
    console.log('contract address:', deployed.address);
  });

  it("Mints a pension and assigns it to owner", async () => {
    const { owner, deployed } = await setup();
    await deployed.safeMint("male", 26, 1996, 30, { value: ethers.utils.parseEther("1") });

    const alreadyMinted = await deployed.verifyIfTheContributorAlreadyMint(owner)
    // eslint-disable-next-line no-unused-expressions
    expect(alreadyMinted).to.be.true;
  })

  it("Verify that the owner that already minted the pension can't mint it again", async() => {
    const { deployed } = await setup();
    await deployed.safeMint("male", 26, 1996, 30, { value: ethers.utils.parseEther("1") });
    await expect(deployed.safeMint("male", 26, 1996, 30, { value: ethers.utils.parseEther("1") })).to.be.revertedWith('Already generated his pension')
  })
});