#!/bin/bash
# this is the first script

cd $(pwd)/../basic-network
./stop.sh
docker rm -f $(docker ps -aq)
cd $(pwd)/../basic-network
./start.sh
cd ../Bidder/configuration
docker-compose -f docker-compose.yml up -d Bidder18Blockchain
cd ../contract/
npm install -g --unsafe-perm
cd ../application
rm -rf wallet/
docker exec Bidder18Blockchain peer chaincode install -n bidder19contract -v 0 -p /opt/gopath/src/github.com/contract -l node


#arguments to instantiate
#name of the bidding item
#public address of the auctioneer
#amount of time the bidding process is valid(in seconds)
#bid type - "sealed" or "public"
docker exec Bidder18Blockchain peer chaincode instantiate -n bidder19contract -v 0 -l node -c '{"Args":["bidder:instantiate","painting","public key","100","public"]}' -C mychannel -P "AND ('Org1MSP.member')"
