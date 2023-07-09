#!/bin/sh
gst-launch-1.0 videotestsrc ! videoconvert ! tcpserversink host=127.0.0.1 port=8090
#rtspsrc location=rtsp://user:***@192.168.1.5:554 ! rtph264depay !
#h264parse ! qtmux ! <http compatible sink>

