import LoginPage from "../pages/LoginPage/LoginPage.tsx";
import {Route, Routes} from "react-router-dom";
import GamePage from "../pages/GamePage/GamePage.tsx";
import './App.scss'

function App() {

  return (
    <>
        <Routes>
            <Route path="/" element={<LoginPage />}/>
            <Route path={"/game"} element={<GamePage />}/>
        </Routes>
    </>
  )
}

export default App
