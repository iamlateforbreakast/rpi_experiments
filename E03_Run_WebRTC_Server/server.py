import os, os.path

import cherrypy
import json
import string

class HelloWorld(object):
	@cherrypy.expose
	def index(self):
		return open("index.html")

	@cherrypy.tools.json_in()
	@cherrypy.tools.json_out()
	@cherrypy.expose
	def offer(self):
		input_json=cherrypy.request.json
		sdp = "v=0"
		sdp = sdp + "o=- 1495799811084970 1495799811084970 IN IP4 0.0.0.0"
		sdp = sdp + "s=-"
		sdp = sdp + "t=0 0"
		sdp = sdp + "a=msid-semantic: WMS"
		return {"sdp": "TEST", "type": "TYPE"}

if __name__ == '__main__':
	conf= {
		'/': {
			'tools.staticdir.root': os.path.abspath(os.getcwd()) },
		'/static': {
			'tools.staticdir.on': True,
			'tools.staticdir.dir': './public' }
		} 
	cherrypy.config.update({'server.socket_host': '0.0.0.0'})	
	cherrypy.config.update({'server.socket_port': 8080})	
	cherrypy.quickstart(HelloWorld(), '/', conf)
