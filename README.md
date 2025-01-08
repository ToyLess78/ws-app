# WS Chat App

## Info

- This project uses [MongoDB Atlas Database](https://www.mongodb.com/products/platform/atlas-database)
- This project uses [NPM Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)

## Requirements

- NodeJS (>=16 <=20)
- NPM (>=8 <=10)

## Start the application

1. Install dependencies

   Run the following command in the root directory to install all dependencies for both the client and server:

   ```bash
   npm i
   ```
2. Start both client and backend simultaneously

   ```bash
   npm start
   ```

3. Start the backend

   To start the backend server only, use:

    ```bash
    npm run dev:server
    ```

4. Start the client

   To start the client application only, use:

    ```bash
    npm run dev:client
    ```

### Available Scripts

Here are the scripts defined in the root `package.json`:

```
    "scripts": {
    "start": "npm run dev --workspace=client & npm run start --workspace=server",
    "dev:client": "npm run dev --workspace=client",
    "dev:server": "npm run start --workspace=server"
    }
```

- `start`: Runs both the client and server simultaneously.
- `dev:client`: Starts the client application only.
- `dev:server`: Starts the backend server only.
