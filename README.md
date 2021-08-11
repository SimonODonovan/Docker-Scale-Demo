# Docker-Scale-Demo
Demonstrate dockers ability to scale services and balance load across these services with nginx. A basic express app is used as the demo service.

nginx.conf is set to recognize up to 2 node.js services that are running and balance the load across them.
To see this in action, use the "--scale" flag when running a docker-compose and validate the service count with:
 - docker-compose up --scale node-app=2
 - docker service ls
