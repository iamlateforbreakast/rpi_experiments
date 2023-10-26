This activity consists in installing the latest Raspbian distribution on a new SD Card to be used by a Raspberry Pi

# General Principle

The aim is to automate the process as much as possible since installing RaspiOS occurs rather a lot.
Ideally I want to launch a command that download the latest RaspiOS and mounts this image. A script is copied to the image that will be executed the first time the Raspberry Pi is started that updates essential parameters.

<img src="images/Installation_process.svg" width=80% height=80%>

# Process:

## Download Raspbian image
see https://lindevs.com/mount-raspberry-pi-os-image-in-linux

## Configure Wifi:

## Disable piWiz:
```shell
sudo rm /run/media/user/rootfs/etc/xdg/autostart/piwiz.desktop
```

## Disable SSH password warning: 
Disable the console warning: 
```shell
sudo rm /etc/profile.d/sshpwd.sh
```

Disable the GUI warning: 
```shell
sudo rm /etc/xdg/lxsession/LXDE-pi/sshpwd.sh
```

## Update distribution

# Automation

To run a script at startup, add a configuration script to /etc/rc.local

bash -c '/home/pi/configure_pi.sh > /home/pi/configure_pi.log 2>&1' &
