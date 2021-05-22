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
            </Switch>
        </Router>
    );
}

export default App;
