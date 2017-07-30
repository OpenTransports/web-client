export production=true

echo 'CLONE'
git clone git@github.com:OpenTransports/opentransports.github.io.git

echo 'CLEAN'
rm dist/*
rm opentransports.github.io/*

echo 'BUILD'
yarn build
cp dist/* opentransports.github.io

echo 'COMMIT AND PUSH'
cd opentransports.github.io
git status
git commit -am "release - $(date +'%d/%m/%Y %H:%M')"
git push

cd ../
export production=
