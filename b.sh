#!/bin/bash

mcount=1
while read line
do
echo $line|sed "s/^/$mcount/g"
mcount=$(($mcount+1))
done < p.txt

