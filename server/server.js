require("./config/url");

// Load config file if on localhost.
if (!process.env.NODE_ENV) {
  require("./config/db");
}

const PORT = process.env.PORT || 3001;

const mongoose = require("mongoose");
const Document = require("./Document");

mongoose
  .connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .catch(e => {
    console.log("cannot connect to db \n", e);
  });

const io = require("socket.io")(PORT, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const defaultValue = "";

io.on("connection", socket => {
  // Document ID is passed from the client.
  socket.on("get-document", async documentId => {
    const document = await findOrCreateDocument(documentId);

    // Send the client to a private room based on the document id.
    socket.join(documentId);
    socket.emit("load-document", document.data);

    // Send the changes to the room.
    socket.on("send-changes", delta => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    // Save the document on user input.
    socket.on("save-document", async data => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

/**
 * Find a document by id or create a new one.
 *
 * @param {Int} id Document ID
 * @returns the existing document or a new one
 */
async function findOrCreateDocument(id) {
  if (id == null) return;

  const document = await Document.findById(id);
  if (document) return document;
  return await Document.create({ _id: id, data: defaultValue });
}
