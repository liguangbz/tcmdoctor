#!/bin/bash

m=$(cat m.txt)
for i in $m
do
echo "db.ports.insert($i)"
echo "db.ports.insert($i)"|mongo
done

