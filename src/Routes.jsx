import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css"

import HomePage from "./Home";

export default function RoutesApp() {
    return (
        <>

            <Routes>

                <Route path="/" element={<HomePage/>}></Route>

            </Routes>

        </>
    )
}