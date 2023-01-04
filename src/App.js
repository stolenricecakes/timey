import Timey from './components/Timey/Timey.js';
import {DarkModeProvider} from "./components/DarkModeContext";

function App() {
  return (
      <DarkModeProvider>
        <Timey/>
      </DarkModeProvider>
  );
}

export default App;
