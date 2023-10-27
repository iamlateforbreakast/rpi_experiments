#!/bin/bash

## Step 0 - Read option parameters
if test -f ./options.txt
then
   HOST=$(cat options.txt | grep "Hostname:" | awk '{printf $2}')
   PI_USER=$(cat options.txt | grep "User:" | awk '{printf $2}')
   WIFI_AP=$(cat options.txt | grep "WifiAP:" | awk '{printf $2}')
   WIFI_PWD=$(cat options.txt | grep "WifiPwd:" | awk '{printf $2}')
else
   echo "Error: options.txt is missing"
   exit 1
fi

## Step 1 - Download RaspiOS
# wget -qO raspios.img.xz https://downloads.raspberrypi.org/raspios_lite_armhf_latest
# unxz raspios.img.xz

# fdisk -l raspios.img

MOUNT_OFFSET_1=$(fdisk -l raspios.img | grep img1 | awk '{print $2 * 512}')
MOUNT_OFFSET_2=$(fdisk -l raspios.img | grep img2 | awk '{print $2 * 512}')

MOUNT_SIZE_1=$(fdisk -l raspios.img | grep img1 | awk '{print $4 * 512}')
MOUNT_SIZE_2=$(fdisk -l raspios.img | grep img2 | awk '{print $4 * 512}')

## Step 2 - Mount image
sudo mkdir -p /mnt/rpi/img1 /mnt/rpi/img2

sudo mount -o offset=$MOUNT_OFFSET_1,sizelimit=$MOUNT_SIZE_1 raspios.img /mnt/rpi/img1
sudo mount -o offset=$MOUNT_OFFSET_2,sizelimit=$MOUNT_SIZE_2 raspios.img /mnt/rpi/img2

## Step 3 - Update parameters
# sudo touch /run/media/thomas/bootfs
sudo sed -i "s/raspberrypi/$HOST/g" /etc/hostname
sudo sed -i "s/raspberrypi/$HOST/g" /etc/hosts
cat /etc/hosts
cat /etc/hostname

# sudo cp wpa_supplicant.conf /run/media/thomas/bootfs/

## Step 4 - Unmount image
sudo umount /mnt/rpi/img1
sudo umount /mnt/rpi/img2
sudo rm -rf /mnt/rpi


