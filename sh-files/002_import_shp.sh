#!/bin/sh

if psql -U postgres "$POSTGRES_DB" -c "SELECT id FROM crimes"; then
    echo "They exists"
else
    echo "Importing shps"
    shp2pgsql -s 4326 shape-files/crimes.shp | psql -U postgres -d "$POSTGRES_DB"
    shp2pgsql -s 4326 shape-files/grid.shp | psql -U postgres -d "$POSTGRES_DB"
    shp2pgsql -s 4326 shape-files/tracts.shp | psql -U postgres -d "$POSTGRES_DB"
fi

