const { expect } = require("chai");
const assert = require('assert');

describe("Token contract", function () {
    it("Deployment should assign the total supply of tokens to the owner", async function () {
        const [owner, addr1] = await ethers.getSigners();
        const TOKEN_SUPPLY = 1000;

        const Token = await ethers.getContractFactory("TokenFactory");
        const hardhatToken = await Token.deploy(TOKEN_SUPPLY, "Apple", "APL");

        const ownerBalance = await hardhatToken.balanceOf(owner.address);
        assert.equal(await hardhatToken.totalSupply(), ownerBalance.toNumber());
    });

    it("Should transfer tokens between accounts", async function () {
        const [owner, addr1, addr2] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("TokenFactory");
        const hardhatToken = await Token.deploy(1000, "Apple", "APL");

        // Transfer 50 tokens from owner to addr1
        await hardhatToken.transfer(addr1.address, 50);
        expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);

        // Transfer 50 tokens from addr1 to addr2
        await hardhatToken.connect(addr1).transfer(addr2.address, 50);
        expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
    });
});
