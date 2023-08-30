The purpose of this activity is to prepare the use of HTTPS for WebRTC usage

Running a DNS on a raspberrypi would allow to use wwww.expi.dev as a domain name on the local network.

![Network](images/network.svg)

## Configuration access point

`sudo apt-get install hostapd`

type `sudo vi /etc/hostapd/hostapd.conf`
And append
```shell
# update with relevant country
country_code=US
interface=wlan0

ssid=[AP_SSID]
hw_mode=g
channel=6
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=[AP_PASS]
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP
```

Execute `sudo vi /etc/default/hostapd` and replace line #DAEMON_CONF with
```text
DAEMON_CONF="/etc/hostapd/hostapd.conf"
```

Start the service
```shell
sudo systemctl unmask hostapd
sudo systemctl start hostapd
```

Add Routing - Repeater - only for routed network (options 1/2)
-----------

Install dnsmasq
```shell
sudo apt-get install dnsmasq
```

#### Set up the DHCP server (dnsmasq)
```shell
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig  
sudo vi /etc/dnsmasq.conf
```
And append to above file
```shell
interface=wlan0
    dhcp-range=10.0.1.2,10.0.1.100,255.255.255.0,12h
```

start the service
```shell
sudo systemctl start dnsmasq
```

#### Add routing
```shell
sudo apt-get install iptables
```

type `sudo vi /etc/sysctl.conf` and uncommon line:
```text
net.ipv4.ip_forward=1
net.ipv6.conf.all.forwarding=1
```
Then run
```shell
## if using eth0 as connection to router
#inter=eth0
inter=wlan1

sudo iptables -t nat -A POSTROUTING -o ${inter} -j MASQUERADE
sudo sh -c "iptables-save > /etc/iptables.ipv4.nat"
```

Edit `sudo vi /etc/rc.local` and append above "exit 0" line 
```shell
iptables-restore < /etc/iptables.ipv4.nat
```

* **only** if setting `wlan1` append to `/etc/network/interfaces.d/raspberry_interfaces` file:
    ```
    # Bridge setup
    auto br0
    iface br0 inet manual
    bridge_ports wlan1 wlan0
    ```
Then `sudo reboot`
