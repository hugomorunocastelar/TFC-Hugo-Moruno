import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./pages/App/App";
import Login from "./pages/Login/Login";

function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<App />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Index