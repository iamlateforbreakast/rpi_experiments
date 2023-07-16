#!/bin/sh
gst-launch-1.0 videotestsrc ! webrtcsink meta="meta,name=gst-stream"
#gst-launch-1.0 videotestsrc is-live=true ! x264enc ! h264parse ! hlssink2 max-files=5
#gst-launch-1.0 videotestsrc ! vp8enc ! webmmux name=stream streamable=true ! tcpserversink host=localhost port=8090
#gst-launch-1.0 videotestsrc ! videoconvert ! video/x-raw,width=320,height=240 ! x264enc key-int-max=12 ! mpegtsmux ! tcpserversink host=localhost port=8090
#rtspsrc location=rtsp://user:***@192.168.1.5:554 ! rtph264depay !
#h264parse ! qtmux ! <http compatible sink>
#        ! videoconvert ! videoscale ! video/x-raw,width=320,height=240 \


