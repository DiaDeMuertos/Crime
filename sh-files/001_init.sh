#!/bin/sh

psql -U "$POSTGRES_USER" "$POSTGRES_DB" -c "CREATE EXTENSION postgis;"