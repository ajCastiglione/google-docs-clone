const local = "http://localhost:3001";
const prod = "https://google-docs-clone-backend-1xz0.onrender.com/";

export function getUrl() {
    if (window.location.host.includes("localhost")) {
        return local;
    } else {
        return prod;
    }
}
