#!/bin/bash

m=$(cat s.txt)
for i in $m
do
echo "db.jingfangs.insert($i)"
##echo "db.jingfangs.insert($i)"|mongo localhost/tcm -u liguang -p liguang
echo "db.jingfangs.insert($i)"|mongo localhost/tcm
done

