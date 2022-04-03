const { expect } = require("chai");

// describe("Token", function () {
//   it("deployement should assign total token to the owner", async function () {
//     //TODO get signer for access accounts
//     const [owner] = await ethers.getSigners();

//     //TODO get contractfactory for get instance of our contracts
//     const Token = await ethers.getContractFactory("Token");

//     //TODO deploy contract
//     const hardhatToken = await Token.deploy();

//     //TODO get token balance of owner
//     const ownerbalance = await hardhatToken.balanceOf(owner.address);

//     expect(await hardhatToken.totalSupply()).to.equal(ownerbalance);
//   });

//   it("Should transfer token between accounts", async function () {
//     //TODO get signer for access accounts
//     const [owner, addr1, addr2] = await ethers.getSigners();

//     //TODO get contractfactory for get instance of our contracts
//     const Token = await ethers.getContractFactory("Token");

//     //TODO deploy contract
//     const hardhatToken = await Token.deploy();

//     //TODO transfer 10 token from owner to addr1

//     await hardhatToken.transfer(addr1.address, 10);

//     expect(await hardhatToken.balanceOf(addr1.address)).to.equal(10);

//     //TODO transfer 5 token from addr1 to addr2

//     await hardhatToken.transfer(addr2.address, 5);

//     expect(await hardhatToken.balanceOf(addr2.address)).to.equal(5);

//   });
// });

describe("Token", function () {
  let Token;
  let hardhatToken;
  let owner;
  let addr1;
  let addr2;
  let addrs;

  beforeEach(async function () {
    Token = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    hardhatToken = await Token.deploy();
  });

  describe("deployement", function () {
    it("should set the right owner", async function () {
      expect(await hardhatToken.owner()).to.equal(owner.address);
    });

    it("should set the right total supply", async function () {
      const ownerbalance = await hardhatToken.balanceOf(owner.address);
      expect(await hardhatToken.totalSupply()).to.equal(ownerbalance);
    });
  });

  describe("transfer", function () {
    it("should transfer token between accounts", async function () {
      //TODO transfer 5 token from owner to addr1
      await hardhatToken.transfer(addr1.address, 5);
      const addr1Balance=await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(5);

      //TODO transfer 5 token from addr1 to addr2
      await hardhatToken.connect(addr1).transfer(addr2.address, 5);
      const addr2Balance=await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(5);
    })

    it("should fail if sender does not have enough tokens",async function(){
      const initialOwnerBalance=await hardhatToken.balanceOf(owner.address);
      await expect(hardhatToken.connect(addr1).transfer(owner.address,1)).to.be.revertedWith("Insufficient balance");
      expect(await hardhatToken.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    })

    it("should update balances after transfer",async function(){
      const initialOwnerBalance=await hardhatToken.balanceOf(owner.address);
      await hardhatToken.transfer(addr1.address,5);
      await hardhatToken.transfer(addr2.address, 10);

      const finalOwnerBalance=await hardhatToken.balanceOf(owner.address);

      expect(finalOwnerBalance).to.equal(initialOwnerBalance-15);

      const addr1Balance=await hardhatToken.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(5);

      const addr2Balance=await hardhatToken.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(10);
    })
  })
});
