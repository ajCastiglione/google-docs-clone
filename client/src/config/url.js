const local = "http://localhost:3001";
const prod = "https://google-docs-clone-mwd.herokuapp.com/";

export function getUrl() {
    if (window.location.host.includes("localhost")) {
        return local;
    } else {
        return prod;
    }
}
