/* CSS */
import './css/App.css';
import './css/reset.css';

import PipModeButton from './component/PipModeButton';
import DevelopNote from './page/DevelopNote';

function App() {
    return (
        <div className="App">
            <h1>TEST</h1>
            <PipModeButton />
            <DevelopNote />
        </div>
    );
}

export default App;
