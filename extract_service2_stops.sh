#!/bin/bash


echo "extracting"

sqlite3 busguides.db << EOF

.schema new_services

select real_stop_id from new_services where service=2;

EOF

