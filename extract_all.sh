#!/bin/bash


echo "extracting"

sqlite3 busguides.db << EOF
.dump new_services

EOF
#.dump bus_stops
#.dump directions
#.dump intersecting
#.dump road_names
#.dump buses
#.dump fare_stage
#.dump time
#.dump company
#.dump info
#.dump new_stops

