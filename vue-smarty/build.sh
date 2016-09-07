#!/bin/bash

MOD_NAME="project_name"
TPL_ROOT="app/pay-php/tpl/"
STA_ROOT="webserver/html"

TAR="$MOD_NAME.tar.gz"

export PATH=/home/fis/npm/bin:$PATH

fis3 --version --no-color

fis3 release prod -d ./temp --no-color --verbose

rm output -rf

mkdir -p output

mkdir -p $TPL_ROOT
mkdir -p $STA_ROOT

rm -rf test

mv temp/static ./$STA_ROOT
mv temp/* ./$TPL_ROOT

tar zcf 'static-'$TAR ./webserver
tar zcf 'tpl-'$TAR ./app

mv 'static-'$TAR ./output/
mv 'tpl-'$TAR ./output/

rm -rf app
rm -rf webserver
rm -rf temp

echo "build end"
