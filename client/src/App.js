import TextEditor from "./TextEditor";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import { v4 } from "uuid";

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact>
                    <Redirect to={`/documents/${v4()}`} />
                </Route>
                <Route path="/documents/:id">
                    <TextEditor />
                </Route>
                {/* If no ID is provided, redirect to a new session. */}
                <Route path="/documents">
                    <Redirect to={`/documents/${v4()}`} />
                </Route>
            </Switch>
        </Router>
    );
}

export default App;
