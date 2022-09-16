#!/bin/bash

if [ "${https_proxy}" -o "${http_proxy}" ]
then
    echo "hmm - you may not have much luck running this through proxies.  you probably wanna disconnect"
fi

docker build -t timey_super .
