This activity consists in installing the latest Raspbian distribution on a new SD Card to be used by a Raspberry Pi

# General Principle

TBC

<img src="images/Installation_process.svg" width=50% height=50%>

# Process

## Download Raspbian image

## Configure Wifi

## Disable piWiz
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

To 
