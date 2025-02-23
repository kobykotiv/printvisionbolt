# How to Run

## Development

To run the application in development mode:

```bash
docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml up -d
```

## Production

To run the application in production mode:

```bash
docker-compose -f docker-compose.base.yml -f docker-compose.production.yml up -d
```

## Enterprise

To run the application in enterprise mode:

```bash
docker stack deploy -c docker-compose.base.yml -c docker-compose.enterprise.yml app
```

## Key Differences Between Environments

### in.Development

- Mounted source code for hot reloading
- Exposed ports for debugging
- Local volumes
- Simple passwords
- No SSL

### in.Production

- SSL enabled
- Environment variables for secrets
- Restart policies
- No source code mounting
- Limited port exposure

### in.Enterprise

- Service replication
- Resource constraints
- Docker secrets
- NFS volumes for shared storage
- Load balancing
- Rolling updates
- Placement constraints

## Configuration Files

Remember to create corresponding `nginx.dev.conf`, `nginx.prod.conf`, and `nginx.enterprise.conf` files with appropriate configurations for each environment.

## Troubleshooting

### "failed to solve: cannot replace to directory ... with file" Error

This error typically occurs due to permission issues or conflicting file operations when Docker tries to mount volumes. Here are a few potential solutions:

1.  **Clean Docker Cache:** Sometimes, outdated cache data can cause conflicts. Try cleaning your Docker cache:

    ```bash
    docker system prune -a --volumes
    ```

    This command removes all stopped containers, unused networks, dangling images, and unused volumes.  Be careful, as it will remove things you might want to keep!

2.  **Volume Permissions:** Ensure that the user inside the container has the necessary permissions to write to the mounted volume. You can try adjusting the ownership of the `node_modules` directory on your host machine:

    ```bash
    sudo chown -R $USER:$USER ./node_modules
    ```

    Replace `$USER` with your actual username.  Alternatively, you can adjust the user inside the Dockerfile.

3.  **Remove and Rebuild:**  Sometimes, the easiest solution is to simply remove the existing containers and rebuild everything:

    ```bash
    docker-compose down -v
    docker-compose -f docker-compose.base.yml -f docker-compose.dev.yml up -d --build
    ```

    The `--build` flag ensures that Docker rebuilds the images from scratch.

4.  **Check for Conflicting Processes:** Make sure no other processes on your host machine are accessing or modifying the files in the mounted volume.

5.  **Docker Desktop File Sharing:** If you are using Docker Desktop, ensure that the directory containing your project is included in the "File sharing" settings.

If none of these solutions work, please provide more details about your Dockerfile and `docker-compose.yml` files for further assistance.