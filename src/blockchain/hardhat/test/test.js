const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("Pension Contract", () => {
  const setup = async () => {
    const [owner] = await ethers.getSigners();
    const Pension = await ethers.getContractFactory("Pension")
    const deployed = await Pension.deploy();

    // getting timestamp
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const blockBefore = await ethers.provider.getBlock(blockNumBefore);
    const timestampBefore = blockBefore.timestamp;

    return {
      owner: owner.address,
      deployed,
      timestampBefore
    }
  }

  it("Address Contract", async () => {
    const { deployed } = await setup();
    console.log('contract address:', deployed.address);
  });

  it("Mints a pension and assigns it to owner", async () => {
    const { owner, deployed, timestampBefore } = await setup();
    await deployed.safeMint("male", 26, 1996, 30, { value: ethers.utils.parseEther("1") });

    const alreadyMinted = await deployed.verifyIfTheContributorAlreadyMinted(owner)
    // eslint-disable-next-line no-unused-expressions
    expect(alreadyMinted).to.be.true;

    const ownerPensionBalance = await deployed.getOwnerPensionsBalance(0);
    const cutoffDate = await deployed.cutoffDate();
    const retirentmentAge = await deployed.retirentmentAge(); // Expected retirement age in days
    const daysAge = ownerPensionBalance.age * 365 * 86400;
    const quoteTime = retirentmentAge - daysAge;
    const retirementDate = parseInt(quoteTime) + parseInt(ownerPensionBalance.pensionCreatedTime);
    const totalSavings = 30 * 24 / 100
    const totalSolidary = 30 * 76 / 100
    //console.log(ownerPensionBalance);
    // Expect the pension creation date to be equal to the bock timestamp
    // Round it to handle the small difference between the block and the minted time
    expect(Math.round(ownerPensionBalance.pensionCreatedTime/5)*5).to.be.closeTo(Math.round(timestampBefore/5)*5,1);
    expect(ownerPensionBalance.retirentmentDate).to.be.equal(retirementDate);
    expect(ownerPensionBalance.totalSavings).to.be.equal(Math.round(totalSavings));
    expect(ownerPensionBalance.totalSolidary).to.be.equal(Math.round(totalSolidary));

  })


  it("Validate the minimum amount to Mint", async () => {
    const { owner, deployed } = await setup();
    await expect(deployed.safeMint("male", 26, 1996, 30, { value: ethers.utils.parseUnits("24","wei") })
    ).to.be.revertedWith('The amount doesn\'t reach the minimum required');
  
  })

  it("Validate the minimum age to Mint", async () => {
    const { owner, deployed } = await setup();
    await expect(deployed.safeMint("male", 17, 1996, 30, { value: ethers.utils.parseUnits("25","wei") })
    ).to.be.revertedWith('You must be 18 years or older to generate a pension');
  
  })

  it("Verify that the owner that already minted the pension can't mint it again", async() => {
    const { deployed } = await setup();
    await deployed.safeMint("male", 26, 1996, 30, { value: ethers.utils.parseEther("1") });
    await expect(deployed.safeMint("male", 26, 1996, 30, { value: ethers.utils.parseEther("1") })).to.be.revertedWith('Already generated his pension')
  })
});