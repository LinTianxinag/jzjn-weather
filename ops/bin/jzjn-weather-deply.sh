#!/usr/bin/env bash

set -xe

VER=${1:-dev}
REG=${2:-registry}

docker build . -t $REG.cn-hangzhou.aliyuncs.com/jzjn-mirror-test/jzjn-weather:$VER


docker push $REG.cn-hangzhou.aliyuncs.com/jzjn-mirror-test/jzjn-weather:$VER
