# Kubernetes Local Setup with kind (Docker)

This document contains clean, corrected, and well‑structured notes for running Kubernetes locally using **kind** and **Docker**, along with deployment and service basics.

---

## 1. Prerequisites

Ensure **Docker Engine** is running locally.

Check Docker:
```bash
docker version
```

Install required tools:
- Docker
- kind
- kubectl

---

## 2. Create a Local Kubernetes Cluster

### `cluster.yml`
```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
  - role: control-plane
  - role: worker
```

Create the cluster:
```bash
kind create cluster --config cluster.yml --name localcluster
```

Verify Docker containers created by kind:
```bash
docker ps
```

Check nodes:
```bash
kubectl get nodes
```

---

## 3. Kubernetes API Access

Kubernetes API endpoint for pods:
```
/api/v1/namespaces/default/pods
```

Direct access requires authentication. Use kubectl proxy:
```bash
kubectl proxy --port=8001
```

Open in browser:
```
http://127.0.0.1:8001/api/v1/namespaces/default/pods
```

To inspect the exact HTTP request sent to API server:
```bash
kubectl get pods --v=8
```

---

## 4. Running a Pod (Quick Test)

Create a pod:
```bash
kubectl run nginxlocal --image=nginx --port=80
```

Check pods:
```bash
kubectl get pods
```

View logs:
```bash
kubectl logs <pod-name>
```

Describe pod:
```bash
kubectl describe pod <pod-name>
```

Delete pod:
```bash
kubectl delete pod <pod-name>
```

---

## 5. Kubernetes Manifests

A **manifest** is a YAML file defining the desired state of a Kubernetes object such as:
- Pod
- ReplicaSet
- Deployment
- Service

Apply any manifest:
```bash
kubectl apply -f manifest.yml
```

---

## 6. Deployment (Production‑Style)

### `deployment.yml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80
```

Apply deployment:
```bash
kubectl apply -f deployment.yml
```

Check resources:
```bash
kubectl get deployments
kubectl get rs
kubectl get pods -o wide
```

### Why Deployment?
- Ensures fixed number of replicas
- Automatically recreates failed pods
- Handles rolling updates
- Supports rollback

Rollout commands:
```bash
kubectl rollout status deployment/nginx-deployment
kubectl rollout history deployment/nginx-deployment
kubectl rollout undo deployment/nginx-deployment
```

---

## 7. Exposing Applications (Services)

### Service Types

1. **ClusterIP**  
   - Default service
   - Internal communication between pods

2. **NodePort**  
   - Exposes service on `<NodeIP>:<NodePort>`
   - Useful for local testing
   - Not recommended for production exposure

3. **LoadBalancer**  
   - Uses cloud provider LB
   - Not available by default in kind
   - Requires MetalLB or Ingress controller locally

---

## 8. NodePort Service Example

### `service-nodeport.yml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-nodeport
spec:
  type: NodePort
  selector:
    app: nginx
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
```

Apply service:
```bash
kubectl apply -f service-nodeport.yml
kubectl get svc
```

Port‑forward alternative:
```bash
kubectl port-forward svc/nginx-nodeport 8080:80
```

Access:
```
http://127.0.0.1:8080
```

---

## 9. Recommended Project Structure

```
k8s-local/
├─ README.md
├─ cluster.yml
├─ deployment.yml
└─ service-nodeport.yml
```

---

## 10. Summary

1. Start Docker
2. Create cluster using kind
3. Verify nodes
4. Deploy application using Deployment
5. Expose app using Service
6. Use LoadBalancer / Ingress in real production

---

This setup reflects a **realistic Kubernetes workflow** while keeping everything runnable locally.
