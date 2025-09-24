# Video App

Node JS application to stream images and videos from the filesystem.

## Start

### Step 1: Ensure Docker and Node are installed on your system

```bash
brew install node docker
```

### Step 2: Create Docker Compose File

Create a new docker compose yaml file that looks like so, in the root of the project:

```yaml
version: "3.9"
services:
  database:
    image: postgres:14
    container_name: va_database
    ports:
      - "5432:5432"
    environment:
      POSTGRES_HOST_AUTH_METHOD: trust
      POSTGRES_USER: user
      POSTGRES_DB: videodb
    restart: always
    volumes:
      - "./pg:/var/lib/postgresql/data"
  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: va_server
    volumes:
      - "/app/node_modules"
      - ./server:/app
    ports:
      - "5000:5000"
    command: ["npm", "run", "dev"]
    restart: always
  client:
    build: 
      context: ./client
      dockerfile: Dockerfile
    container_name: va_client
    volumes:
      - "/app/node_modules"
      - ./client:/app
    ports:
      - "3000:3000"
    command: ["npm", "start"]
    restart: always
```

To mount images and videos to the app, include more volumes under `server.volumes`, targeting: `/app/videos` or `/app/images`.

For example, if your videos are stored localy in `/Users/JonDoe/Desktop/Movies`, your `server.volumes` will look like:
```yaml
    volumes:
      - "/app/node_modules"
      - ./server:/app
      - /Users/JonDoe/Desktop/Movies:/app/videos
```

### Step 3: start the App

You can start your app by using the provided start script. After a few seconds, you can access the client app using your web-browser: `http://localhost:3000/`