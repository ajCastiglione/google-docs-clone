# Google Docs Clone

Built to replicate the live document editing experience of Google docs.

## Requirements

1. Mongo DB
2. Node (16.x)

## Features

- Unique IDs per session
- Live updates if a URL is shared with another user
- Saves every 2 seconds to instance based on URL ID
- Rich text editor from QuillJS
- Print friendly

# Start the application

- Run `npm install` in the root directory and the `/client` directory
- Run `npm run dev` in root directory to start local development instance. This will start the server and client concurrently
- Open `localhost:3000` to view the document (if it doesn't open automatically)
