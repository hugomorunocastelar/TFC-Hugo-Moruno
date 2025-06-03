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
import ClubView from "./pages/App/components/clubs/partials/ClubView/ClubView";

// Admin partials
import Users from "./pages/Admin/partials/Users/Users";
import Person from "./pages/Admin/partials/Person/Person";
import Referee from "./pages/Admin/partials/Referee/Referee";
import Coach from "./pages/Admin/partials/Coach/Coach";
import Player from "./pages/Admin/partials/Player/Player";
import AdminClubs from "./pages/Admin/partials/Clubs/Clubs";
import City from "./pages/Admin/partials/City/City";
import League from "./pages/Admin/partials/League/League";
import Team from "./pages/Admin/partials/Team/Team";
import Gameplace from "./pages/Admin/partials/Gameplace/Gameplace";
import Season from "./pages/Admin/partials/Season/Season";
import Game from "./pages/Admin/partials/Game/Game";
import Welcome from "./pages/Admin/partials/WelcomeAdmin/Welcome";

function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="competitions/:competition/:category" element={<Competition />} />
          <Route path="competitions" element={<Competitions />} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="clubs/:id" element={<ClubView />} />
        </Route>
        <Route path="admin" element={<AuthGuard><Admin /></AuthGuard>}>
          <Route path="" element={<Welcome />}></Route>
          <Route path="users" element={<Users />} />
          <Route path="person" element={<Person />} />
          <Route path="referee" element={<Referee />} />
          <Route path="coach" element={<Coach />} />
          <Route path="player" element={<Player />} />
          <Route path="clubs" element={<AdminClubs />} />
          <Route path="city" element={<City />} />
          <Route path="league" element={<League />} />
          <Route path="team" element={<Team />} />
          <Route path="gameplace" element={<Gameplace />} />
          <Route path="season" element={<Season />} />
          <Route path="game" element={<Game />} />
        </Route>
        <Route path="*" element={<Error />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Index;
