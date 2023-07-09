import os, os.path

import cherrypy

class HelloWorld(object):
	@cherrypy.expose
	def index(self):
		return open("index.html")

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
