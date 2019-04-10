/*
 * SPDX-License-Identifier: Apache-2.0
 */
/*
*
command line arguments :
1st argument : bidder id(username)
2nd argument : bidding price
*/
'use strict';

const { FileSystemWallet, Gateway } = require('fabric-network');
const fs = require('fs');
const path = require('path');
const config= require('./config.js');
const ccpPath = path.resolve(__dirname, '..', '..', 'basic-network', 'connection.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

var bidder=''
var bid=''
var user=''
//get the sender name and receiver name from command line argument 
const args = process.argv.slice(2)
if(args[0] && args[1]){
bidder=args[0].toString()
bid=args[1].toString()
}
else
{
    bidder="test"
    bid=0
}
async function main() {
    try {

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if sender is registered .
        user=bidder
        const bidderExists = await wallet.exists(user);
        if (!bidderExists) {
            console.log(`An identity for the user ${user} does not exist in the wallet`);
            console.log('Run the registerUser.js application before retrying');
            return;
        }
    
       
        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: user, discovery: { enabled: false } });

        // Get tThe ordering service coordinates transactions for a networkhe network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(config.network);

        // Get the contract from the network.
        const contract = network.getContract(config.contract);

        // Submit the specified transaction.
        // Bidder bids the amount for the auction
         await contract.submitTransaction('Bid', bidder, bid);
        console.log('Transaction has been submitted');

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {
        console.error(`Failed to submit transaction: ${error}`);
        process.exit(1);
    }
}

main();