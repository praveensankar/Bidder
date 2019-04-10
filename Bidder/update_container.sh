#!/bin/bash
# this is the first script

cd /media/praveen/praveen/blockchain/fabric-samples/Bidder/configuration
docker-compose -f docker-compose.yml up -d BidderBlockchain
docker exec BidderBlockchain peer chaincode install -n biddercontract -v 0 -p /opt/gopath/src/github.com/contract -l node
docker exec BidderBlockchain peer chaincode instantiate -n biddercontract -v 0 -l node -c '{"Args":["bidder:instantiate","painting","public key","10","sealed"]}' -C mychannel -P "AND ('Org1MSP.member')"
