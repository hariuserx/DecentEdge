counter=0

while read name; do
    node transferETH.js $name &
    sleep 5
    ((counter++))
    # echo $counter
    if (("$counter" == 100))
    then
        echo "100 transactions complete"
        #counter=0
        sleep 20
        #break
    fi
done < "address.txt"