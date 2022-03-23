#!/bin/bash

echo "Setting up mongo cluster for $MONGODB1 & $MONGODB2 & $MONGODB3"

echo "**********************************************" ${MONGODB1}
echo "Waiting for startup.."
sleep 5
echo "done"

echo SETUP.sh time now: `date +"%T" `
mongo --host ${MONGODB1}:27017  <<EOF
cfg = {
  "_id": "rs0",
  "protocolVersion": 1,
  "version": 1,
  "members": [
    {
      "_id": 0,
      "host": "${MONGODB1}:27017",
      "priority": 2
    },
    {
      "_id": 1,
      "host": "${MONGODB2}:27017",
      "priority": 0
    },
    {
      "_id": 2,
      "host": "${MONGODB3}:27017",
      "priority": 0,
    }
  ]
};
rs.initiate(cfg, { force: true });
rs.secondaryOk();
db.getMongo().setReadPref('primary');
rs.status();
EOF
