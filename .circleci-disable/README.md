```
version: 2.1

orbs:
  node: circleci/node@5.0.2
  docker: circleci/docker@2.1.2
executor:
  docker-publisher:
    environment:
      IMAGE_NAME: ndukwearm19docker/docker-node-app
    docker: # Each job requires specifying an executor
    # (either docker, macos, or machine), see
      - image: circleci/node:latest
        auth:
            username: $DOCKERHUB_USERNAME
            password: $DOCKERHUB_PASSWORD


jobs:
  publishLatestToHub: 
      executor: docker-publisher

      steps: 
        - checkout
        - setup_remote_docker
        - run: 
            name: Publish Docker Image to Docker Hub
            command: |
              echo "$DOCKERHUB_PASSWORD" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin
              docker build -t $IMAGE_NAME .
              docker push $IMAGE_NAME:dev
workflows:
  version: 2
  build-master:
    jobs:
       - publishLatestToHub
```