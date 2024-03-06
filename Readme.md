# Auto-Scaling Websockets using Traefik and Sticky Session cookies

Uses docker-compose file for spawning containers.

## For finding Sticky Session hash values
- Go to https://md5calc.com/hash.
- Select `FNV1A64` Algorithm for hashing
- Go to your terminal and find the container's internal ip address, for ex: `172.20.0.2` looks something like this. 
- Paste the IP address of the container with protocol and the port you exposed from the container to traefik, for ex: `http://172.20.0.2:3000`. This will give you the hash which is something like this `a3d52f0267943dcc`
- Then go to your frontend-app and set cookie with hash value with appropriate cookie name you configured in Traefik.

### For more Advanced/Scaling millions of connections you can use Traefik Clustering or Kubernetes with Traefik as ingress controller.

You can programmatically generate hash based on IP. To get IP's you can use Traefik's management/admin API to get all the list of connected servers and use hashing package, there are packages available for `FNV1A64` algorithm for NodeJs. I also made a demo available in github, [check it out if you find it interesting](https://github.com/07prajwal2000/High-Availability-With-Kubernetes/blob/main/traefik-hash-finder-node/index.js).

### Example hash table
```text
http://172.20.0.2:3000 = a3d52f0267943dcc
http://172.20.0.4:3000 = b0b778ca5c8e3c2a
http://172.20.0.5:3000 = 02924b402664a5b7
```

## I've made a sample Chat App using ExpressJs and Socket.io
Application has 3 routes
- `/` - which returns html content
- `/hostname` - returns json response with ip and hostname
- `/ws` - websocket endpoint

I successfully able to load-balance and connect to any container using hash value with sticky session. Here no need for Redis server to send message from one server to other, as your application is redirecting the user's request to specific server (But you need to manage where the user should be routed and how many connections can a server handle).

I made this research specifically for websocket based multiplayer games.

## There are many Loadbalancers available, for example
- Nginx
- HA Proxy
- Envoy
- many more ...

I found Traefik easy to configure, and develop upon. It supports dynamic configuration, for ex: containers can be added and removed based on the load, then traefik will automatically pick up the IPs from wherever you've configured (Docker or K8s or Consul service discovery). But the above listed LBs require Pro/Enterprise version for this kind of feature. Traefik supports out-of-the-box.