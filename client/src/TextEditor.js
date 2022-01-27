import React, { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

import { getUrl as url } from "./config/url";

const SAVE_INTERVAL = 2000;
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
];

export default function TextEditor() {
    const { id: documentId } = useParams();
    const [socket, setSocket] = useState();
    const [quill, setQuill] = useState();

    // Connect to a new socket.
    useEffect(() => {
        const s = io(url());
        setSocket(s);

        // Disconnect after unmount.
        return () => {
            s.disconnect();
        };
    }, []);

    // Load the document from the server.
    useEffect(() => {
        if (socket == null || quill == null) return;

        socket.once("load-document", (document) => {
            quill.setContents(document);
            quill.enable();
        });

        socket.emit("get-document", documentId);
    }, [socket, quill, documentId]);

    // Save the document at the defined interval.
    useEffect(() => {
        if (socket == null || quill == null) return;

        const interval = setInterval(() => {
            socket.emit("save-document", quill.getContents());
        }, SAVE_INTERVAL);

        return () => {
            clearInterval(interval);
        };
    }, [socket, quill]);

    // Update the document if a user changes it.
    useEffect(() => {
        if (socket == null || quill == null) return;

        const handler = (delta) => {
            quill.updateContents(delta);
        };

        socket.on("receive-changes", handler);

        return () => {
            socket.off("receive-changes", handler);
        };
    }, [socket, quill]);

    // Save changes on user input. 
    useEffect(() => {
        // Ensure that the quill & socket instance are initialized.
        if (socket == null || quill == null) return;

        const handler = (delta, oldDelta, source) => {
            // Check that it was user input.
            if (source !== "user") return;
            socket.emit("send-changes", delta);
        };

        quill.on("text-change", handler);

        // Remove listener on unmount.
        return () => {
            quill.off("text-change", handler);
        };
    }, [socket, quill]);

    // Use memoized callback to prevent re-rendering.
    const wrapperRef = useCallback((wrapper) => {
        // Ensure wrapper is defined before setting quill.
        if (wrapper == null) return;

        // Clear wrapper before setting quill.
        wrapper.innerHTML = "";
        const editor = document.createElement("div");

        wrapper.append(editor);

        const q = new Quill(editor, {
            theme: "snow",
            modules: {
                toolbar: TOOLBAR_OPTIONS,
            },
        });

        // Disable editor while loading.
        q.disable();
        q.setText("Loading...");
        setQuill(q);
    }, []);
    return <div className="container" ref={wrapperRef}></div>;
}
