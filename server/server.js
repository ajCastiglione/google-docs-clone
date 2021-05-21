require("./config/url");

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
    .catch((e) => {
        console.log("cannot connect to db \n", e);
    });

const io = require("socket.io")(PORT, {
    cors: {
        origin: process.env.URL,
        methods: ["GET", "POST"],
    },
});

const defaultValue = "";

io.on("connection", (socket) => {
    socket.on("get-document", async (documentId) => {
        const document = await findOrCreateDocument(documentId);
        socket.join(documentId);
        socket.emit("load-document", document.data);

        socket.on("send-changes", (delta) => {
            socket.broadcast.to(documentId).emit("receive-changes", delta);
        });

        socket.on("save-document", async (data) => {
            await Document.findByIdAndUpdate(documentId, { data });
        });
    });
});

async function findOrCreateDocument(id) {
    if (id == null) return;

    const document = await Document.findById(id);
    if (document) return document;
    return await Document.create({ _id: id, data: defaultValue });
}
