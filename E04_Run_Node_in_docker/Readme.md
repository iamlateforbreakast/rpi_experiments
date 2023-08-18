install docker

pull arm32v7/node:latest image

Pull Alpine Linux image (small footprint) with Npm latest
---------------------------------------------------------

`docker image pull arm32v7/node:alpine`

Modify image to add express
Create a dockerfile to modify image

`docker build . -t my_image`

Listing Docker images
---------------------

`docker images ls`

Inspect logs
------------
Get container id:
docker ps 

docker logs <container id>

Useful commands
---------------
List all container stopped or running
`docker ps -a`

Stop a running container
`docker stop <container id>`

Remove a stopped container
`docker rm <container id>`
