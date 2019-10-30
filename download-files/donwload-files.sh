#!/bin/sh

wget -O csv-files.zip --no-check-certificate "https://onedrive.live.com/download?cid=8FD49A24D2F6BA30&resid=8FD49A24D2F6BA30%21107877&authkey=AL7O6ap4Zmm3294"
wget -O shape-files.zip --no-check-certificate "https://onedrive.live.com/download?cid=8FD49A24D2F6BA30&resid=8FD49A24D2F6BA30%21107878&authkey=AKpGlRC0yZQr6Oc"

unzip csv-files.zip -d ../
unzip shape-files.zip -d ../

rm *.zip