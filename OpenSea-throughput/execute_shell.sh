counter=0

while read name; do
    node interact.js $name
    sleep 0.2
    #break
    ((counter++))
    # echo $counter
    if (("$counter" == 1000))
    then
        echo "1000 approvals complete"
        counter=0
        # sleep 20
        break
    fi
done < "privateKey.txt"
