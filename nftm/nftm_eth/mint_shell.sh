counter=0

while read name; do
    node scripts/mint-nft-sepolia-throughput.js $name &
    sleep 0.3
    #break
    ((counter++)) 
    # echo $counter
    if (("$counter" == 10))
    then
        echo "10 mints complete"
        counter=0
        # sleep 20
        break
    fi
done < "privateKey.txt"
