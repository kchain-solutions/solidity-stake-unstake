const assert = require('assert');
const { ethers } = require('hardhat');

const STAKE_AMOUNT = 50;

let TokenContract = undefined;
let stakeContract = undefined;
let stakeDeploy = undefined;
let stakeInstanceOwner = undefined;
let owner = undefined;
let user = undefined;

describe("Stake contract", () => {

    beforeEach(async () => {
        const TOKEN_SUPPLY = 1000;
        const Token = await ethers.getContractFactory("TokenFactory");
        TokenContract = await Token.deploy(TOKEN_SUPPLY, "Apple", "APL");
        const [_owner, _user] = await ethers.getSigners();
        owner = _owner;
        user = _user;

        stakeContract = await ethers.getContractFactory("Stake");
        stakeDeploy = await stakeContract.deploy(TokenContract.address);
        stakeInstanceOwner = await new ethers.Contract(stakeDeploy.address, stakeContract.interface, owner);
    });

    it("Stake contract deploy test", async () => {
        assert(stakeDeploy);
        assert(stakeInstanceOwner);
    });

    it("Stake test", async () => {
        let prevBalance = await TokenContract.balanceOf(owner.address);
        //It's necessary delegate the smartcontract to move funds
        await TokenContract.approve(stakeInstanceOwner.address, STAKE_AMOUNT);
        await stakeInstanceOwner.stake(STAKE_AMOUNT);
        let newBalance = await TokenContract.balanceOf(owner.address);
        let contractBalance = await TokenContract.balanceOf(stakeDeploy.address);

        assert.equal(prevBalance.toNumber() - newBalance.toNumber(), STAKE_AMOUNT);
        assert.equal(contractBalance.toNumber(), STAKE_AMOUNT);

    });

    it("Stake incorrect amount test", async () => {
        let prevBalance = await TokenContract.balanceOf(owner.address);
        //It's necessary delegate the smartcontract to move funds
        let error = false;
        try {
            await TokenContract.approve(stakeInstanceOwner.address, STAKE_AMOUNT);
            await stakeInstanceOwner.stake(1000 + 1);
        } catch (ex) {
            error = true;
        }
        assert.equal(error, true);
    });

    it("Unstake test", async () => {
        await TokenContract.approve(stakeInstanceOwner.address, STAKE_AMOUNT);
        await stakeInstanceOwner.stake(STAKE_AMOUNT);

        let prevBalance = await TokenContract.balanceOf(owner.address);
        await stakeInstanceOwner.unstake(STAKE_AMOUNT);
        let newBalance = await TokenContract.balanceOf(owner.address);
        let contractBalance = await TokenContract.balanceOf(stakeDeploy.address);

        assert.equal(newBalance.toNumber() - prevBalance.toNumber(), STAKE_AMOUNT);
        assert.equal(contractBalance.toNumber(), 0);
    });

    it("Unstake incorrect amount test", async () => {
        await TokenContract.approve(stakeInstanceOwner.address, STAKE_AMOUNT);
        await stakeInstanceOwner.stake(STAKE_AMOUNT);

        let prevBalance = await TokenContract.balanceOf(owner.address);
        let error = false;
        try {
            await stakeInstanceOwner.unstake(STAKE_AMOUNT + 1);
            let newBalance = await TokenContract.balanceOf(owner.address);
            let contractBalance = await TokenContract.balanceOf(stakeDeploy.address);
        } catch (ex) {
            error = true;
        }
        assert.equal(error, true);
    });

});

