import Header from "./Components/Header";
import MultiPage from "./Components/MultiPage";
import Web3Caller from "./Components/Web3Caller";
import { Route,Routes } from "react-router-dom";
function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={[<Header/>,<Web3Caller/>]}/>
        <Route path="/contracts/:addr" element={[<Header/>,<MultiPage/>]}/>
      </Routes>
    </div>
  );
}

export default App;
