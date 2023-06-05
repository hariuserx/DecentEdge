counter=0

while true; do
    node scripts/mint-nft.js $name
    sleep 20
    ((counter++)) 
    if (("$counter" == 20))
    then
        echo "20 mints complete"
        break
    fi
done
