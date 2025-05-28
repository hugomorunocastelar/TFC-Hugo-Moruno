import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./pages/App/App";
import Login from "./pages/Login/Login";
import Error from "./pages/Error/Error";
import Home from "./pages/App/components/home/Home";
import Competitions from "./pages/App/components/competitions/Competitions";
import AuthGuard from "./AuthGuard";
import Admin from "./pages/Admin/Admin";
import Competition from "./pages/App/components/competition/Competition";
import Clubs from "./pages/App/components/clubs/Clubs";

function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} >
          <Route path="/" element={<Home />}/>
          <Route path="competitions/:competition/:category" element={<Competition />}></Route>  
          <Route path="competitions" element={<Competitions />}>
          </Route>
          <Route path="clubs" element={<Clubs />}/>
        </Route>
        <Route path="admin" element={<AuthGuard><Admin /></AuthGuard>}>
          <Route path="users" element={<p>USERS</p>} >
          </Route>
        </Route>
        <Route path="*" element={<Error />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Index