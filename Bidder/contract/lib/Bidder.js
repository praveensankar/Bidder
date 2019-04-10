


'use strict';

const {Contract , Context } = require('fabric-contract-api');



// this is the BidderContext class 
class BidderContext extends Context{
    constructor()
    {
        super();
    }

   
}

class Bidder extends Contract
{



constructor()
{
    super('bidder');
   

}

createContext()
{
        return new BidderContext();
}

/*
 @param {Context} ctx the transaction context
*/


/*
@param {String} auctioneerName the username of the auctioneer
@param {String} auctioneerAddress the public key of the auctioneer
 @param {String} deadline no of seconds auction is valid
 @param {String} bidType 'public' or 'sealed'
*/
async instantiate(ctx,auctioneerName,auctioneerAddress,deadline,bidType)
{
    console.info('============= START : Initialize Ledger ===========');
    this.auctioneerName=auctioneerName;
    this.auctioneerAddress=auctioneerAddress;
    this.startTime=new Date().getTime();
    this.endTime=new Date().getTime()+(1000*Number(deadline));
   
    if(bidType==='public'||bidType==='sealed')
    this.bidType=bidType;
    else
    throw new Error(`${bidType} should be either 'public' or 'sealed'`);

    console.info('============= END : Initialize Ledger ===========');
}
/*
@param {Context} ctx the transaction context
@param {String} bidder sender id 
*/
async getBidbyBidder(ctx,bidder) {
  
    const nodeAsBytes = await ctx.stub.getState(bidder); // get the node from chaincode state
    if (!nodeAsBytes || nodeAsBytes.length === 0) {
        throw new Error(`${bidder} does not exist`);
    }
    console.log(nodeAsBytes.toString());
    return nodeAsBytes.toString();
}
/*
@param {Context} ctx the transaction context
*/
async getAllBid(ctx) {
  

    const startKey = '';
    const endKey = '';

    const iterator = await ctx.stub.getStateByRange(startKey, endKey);

    const allResults = [];
    while (true) {
        const res = await iterator.next();

        if (res.value && res.value.value.toString()) {
            console.log(res.value.value.toString('utf8'));

            const Key = res.value.key;
            let bid;
            try {
                bid = JSON.parse(res.value.value.toString('utf8'));
            } catch (err) {
                console.log(err);
                bid = res.value.value.toString('utf8');
            }
            allResults.push({ Key, bid });
        }
        if (res.done) {
            console.log('end of data');
            await iterator.close();
            console.info(allResults);
            if(this.bidType==="sealed")
            {
            if(this.endTime<new Date().getTime())
            {
            return JSON.stringify(allResults);
            }
            else
            {
                throw new Error('bids will be revealed only after the deadline');
            }
        }
            if(this.bidType==="public")
            {
                return JSON.stringify(allResults);
            }
        
        }
    }

}


async getDetails(ctx)
{
   var Name=this.auctioneerName;
   var auctioneerAddress=this.auctioneerAddress;
   var startTime=this.startTime;
   var endTime=this.endTime;
  var bidType=this.bidType;
    var details = {Name,auctioneerAddress,
        startTime,endTime,bidType};
        return JSON.stringify(details);
}



/*
@param {Context} ctx the transaction context
*/
async getHighestBid(ctx) {
    

    const startKey = '';
    const endKey = '';

    const iterator = await ctx.stub.getStateByRange(startKey, endKey);

    const allResults = [];
    while (true) {
        const res = await iterator.next();

        if (res.value && res.value.value.toString()) {
            console.log(res.value.value.toString('utf8'));

            const Key = res.value.key;
            let bid;
            try {
                bid = JSON.parse(res.value.value.toString('utf8'));
            } catch (err) {
                console.log(err);
                bid = res.value.value.toString('utf8');
            }
            allResults.push({ Key, bid });
        }
        if (res.done) {
            console.log('end of data');
            await iterator.close();
            console.info(allResults);
            const result=JSON.stringify(allResults);
            //get the bid values
            const r2=JSON.parse(result);
           // const r1=JSON.parse(r2);
            const bids=r2.map(ele=>{   return ele.bid; });
            let highestBid=-1;
            for(let i=0;i<bids.length;i++)
            {
            if(highestBid<Number(bids[i]))
            highestBid=bids[i];
            }
            console.log(highestBid);
            if(this.bidType==="sealed")
            {
            if(this.endTime<new Date().getTime())
            {
            return JSON.stringify(highestBid);
            }
            else
            {
                throw new Error('bids will be revealed only after the deadline');
            }
        }
            if(this.bidType==="public")
            {
                return JSON.stringify(highestBid);
            }
            
        }
    }
    }
    


/*
@param {Context} ctx the transaction context
*/
async getHighestBidder(ctx) {
    
    const startKey = '';
    const endKey = '';

    const iterator = await ctx.stub.getStateByRange(startKey, endKey);

    const allResults = [];
    while (true) {
        const res = await iterator.next();

        if (res.value && res.value.value.toString()) {
            console.log(res.value.value.toString('utf8'));

            const Key = res.value.key;
            let bid;
            try {
                bid = JSON.parse(res.value.value.toString('utf8'));
            } catch (err) {
                console.log(err);
                bid = res.value.value.toString('utf8');
            }
            allResults.push({ Key, bid });
        }
        if (res.done) {
            console.log('end of data');
            await iterator.close();
            console.info(allResults);
            
            //get the bid values
            //const r1=JSON.parse(allResults);
            //const r2=JSON.parse(r1);
            //console.log(r2+typeof r2);
            const bids=allResults.map(ele=>{   return ele; });
            let highestBid=-1;
            let winner=undefined;
            console.log(bids.length);
            for(let i=0;i<bids.length;i++)
            {
              let record=bids[i];
              console.log(record.bid);
              if(highestBid<Number(record.bid))
              {
                  highestBid=record.bid;
                  winner=record.Key;
              }
            }
            console.log(winner);
            if(this.bidType==="sealed")
            {
            if(this.endTime<new Date().getTime())
            {
            return JSON.stringify(winner);
            }
            else
            {
                throw new Error('bids will be revealed only after the deadline');
            }
        }
            if(this.bidType==="public")
            {
                return JSON.stringify(winner);
            }
            
        }
    }
}
/*
@param {Context} ctx the transaction context
@param {String} bidder sender id 
@param {Number} price bidding price
 */
async Bid(ctx,bidder,price) {
    console.info('============= START : Add bid ===========');

    const bid = {
        price,
        docType: 'bid',
        
    };
    if(this.endTime<new Date().getTime())
    {
        throw new Error("auction is over");
    }
     if((this.bidType==='sealed')&&(this.endTime>new Date().getTime()))
    {
        const nodeAsBytes = await ctx.stub.getState(bidder); // get the node from chaincode state
   
        if (!nodeAsBytes || nodeAsBytes.length === 0) {
    
        await ctx.stub.putState(bidder, Buffer.from(JSON.stringify(price)));
        }
	    else
	    {
	    throw new Error(`${bidder} already sent bid`);
        }
    }
    if((this.bidType==='public')&&(this.endTime>new Date().getTime()))
    {
        await ctx.stub.putState(bidder, Buffer.from(JSON.stringify(price)));
        
    }
 console.info('============= END :  End addition ===========');
}





}


module.exports=Bidder;
