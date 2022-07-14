const CryptoCoders = artifacts.require("CryptoCoders");

contract('CryptoCoders', () => {

  let contract;
  before(async() => {
    contract = await CryptoCoders.deployed();
  })

  it('should get deployed', async() => {
   assert.notEqual(contract , "")
  });

  it("... gets minted and added" , async() => {
    const result = await contract.mint("Ronak");
    let coder =  await contract.coders(0);

    assert.equal(coder,"Ronak");
  })


}); 
 