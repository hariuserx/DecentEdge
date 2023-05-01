for i in {1..1000};
        do
                # echo $i;
                # echo $((50+$i));
                node createWallet.js &
                sleep 1
        done;