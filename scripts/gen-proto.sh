#!/bin/bash
PROTO_ROOT=./proto
PROTO_OUT=./libs/microservice/src/proto

# Path to this plugin, Note this must be an abolsute path on Windows (see #15)
PROTOC_GEN_TS_PATH="./node_modules/.bin/protoc-gen-ts_proto"

protoc \
    --plugin="${PROTOC_GEN_TS_PATH}" \
    --ts_proto_out=${PROTO_OUT} \
		--ts_proto_opt=nestJs=true \
		--ts_proto_opt=addGrpcMetadata=true \
    --ts_proto_opt=unrecognizedEnum=false \
    --ts_proto_opt=forceLong=string \
    --ts_proto_opt=useOptionals=true \
		--proto_path=${PROTO_ROOT} \
    $(find ${PROTO_ROOT} -name "*.proto")

./node_modules/.bin/prettier --config ./.prettierrc --write ${PROTO_OUT}
