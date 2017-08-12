#!/bin/sh -x
set -x

export production=true

if [ ! -d opentransports.github.io ]
then
	git clone git@github.com:OpenTransports/opentransports.github.io.git
fi

rm -f dist/*
rm -f opentransports.github.io/*

yarn build
cp dist/* opentransports.github.io

cd opentransports.github.io

git add .
git status -s
git commit -am "$(date +'%d/%m/%Y %H:%M') - $1"
git push

cd ../
export production=
