# Catch Up

This is my example exercise about deploying NestJS application to Kubernetes Cluster with Helm.

## Build Docker Image

Navigate to `nest-api` directory at `dev` branch and you will found the Dockerfile configuratio inside that can be use to build docker image for nestjs container. Let's build the docker image first.

```bash
docker build -t <your_dockerhub_username>/simple-nestjs-api:v1
```
Then, verify that the docker image successfully created
```bash
docker images
```
## Install NFS Storage

Before going to deploy the database (PostgreSQL) and the NestJS application to Kubernetes, we need to setup the NFS first for storing our data.

In your kubernetes master, do this:
```
# Install NFS package
sudo apt-get update
sudo apt-get install nfs-common nfs-kernel-server -y

# Create NFS directory
sudo mkdir -p /data/nfs
sudo chown nobody:nogroup /data/nfs
sudo chmod 2770 /data/nfs

# Create NFS configuration
echo -e "/data/nfs\t<your_ip>/24(rw,sync,no_subtree_check,no_root_squash)" | sudo tee -a /etc/exports

# Test the configuration
sudo exportfs -av

# Restart and check the nfs service
sudo systemctl restart nfs-kernel-server
sudo systemctl status nfs-kernel-server
```
Then, in your kubernetes workers, do this:
```bash
sudo apt update
sudo apt install nfs-common -y
```

## Deploy Database (PostgreSQL)

Now, we will deploy the database first using helm chart. Navigate to `db` directory at `postgres` branch, then exec below command:
```bash
helm install postgres ./postgres
```
Verify that the instalation is successfull and running
```bash
helm list
kubectl get all
```
Try to login to database using our credentials.
```bash
kubectl exec -it <postgres_pod_name> -- /bin/bash
psql -U <your_username> -d <your_database>

# Make sure you can successfully authenticated
```

## Deploy NestJS (API)

Now, we will deploy the nestjs application using helm chart. Navigate to `bookshelf` directory at `helm` branch, then exec below command:
```bash
helm install bookshelf ./bookshelf
```
Verify that the instalation is successfull and running
```bash
helm list
kubectl get all
```
Now, see the logs of our deployments.
```bash
kubectl logs -f <bookshelf_pod_name>

# Make sure that your service can connect to database
```
