const crypto = require('crypto');

class Block {
  constructor(index, timestamp, transactions, previousHash = '') {
    this.index = index; // ← index is being assigned here
    this.timestamp = timestamp;// timestamp assigned here
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0; //used for proof-of-work
    this.hash = this.calculateHash();
  }

  // Method to calculate the SHA256 hash of the block's contents
  calculateHash() {
    return crypto.createHash('sha256')
      .update(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce)
      .digest('hex');
  }

// Method to simulate proof-of-work (mining) by finding a hash starting with '00'

  mineBlock(difficulty) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;//increasing nonce until correct correct hash is found
      this.hash = this.calculateHash();//Recalculate hash
    }
    console.log(`Block mined: ${this.hash}`);//mined block's hash
  }
}

//Blockchain class managing chain of blocks

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()]; // Initialize chain with Genesis block
    this.difficulty = 2; // Difficulty level for mining (number of zeros required in hash)
  }

  //Creating first block in blockchain(Genesis block)
  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), 'Genesis Block', '0');
  }
 
   // Getting the latest block from the chain
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }
 //adding a new block to the blockchain
  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    newBlock.mineBlock(this.difficulty); // Optional Proof-of-Work
    this.chain.push(newBlock);
  }

  //validating the integrity of blockchain
  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

 // Check if the block’s hash is still correct
      if (current.hash !== current.calculateHash()) {
        return false;
      }

      if (current.previousHash !== previous.hash) {
        return false;
      }
    }
    return true;//blockchain is valid
  }

  printChain() {
    console.log(JSON.stringify(this.chain, null, 2));
  }
}

// Simulating the Blockchain
let demoChain = new Blockchain();

// Adding  some dummy transactions
console.log("Adding block 1...");
demoChain.addBlock(new Block(1, new Date().toISOString(), [{ from: "Alice", to: "Bob", amount: 100 }]));

console.log("Adding block 2...");
demoChain.addBlock(new Block(2, new Date().toISOString(), [{ from: "Bob", to: "Charlie", amount: 50 }]));

// Print original chain
console.log("\nOriginal Blockchain:");
demoChain.printChain();

// Tampering test
demoChain.chain[1].transactions = [{ from: "Alice", to: "Eve", amount: 1000 }];

console.log("\nAfter Tampering:");
console.log("Is blockchain valid?", demoChain.isChainValid());
