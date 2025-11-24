import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./pages/App/App";
import Login from "./pages/Login/Login";
import Error from "./pages/Error/Error";
import Home from "./pages/App/components/home/Home";
import Competitions from "./pages/App/components/competitions/Competitions";
import AuthGuard from "./AuthGuard";
import Admin from "./pages/Admin/Admin";
import ShowCompetition from "./pages/App/components/showCompetition/ShowCompetition";
import Clubs from "./pages/App/components/clubs/Clubs";
import ClubView from "./pages/App/components/clubs/partials/ClubView/ClubView";
import Contact from "./pages/App/components/contact/Contact";
import Referee from "./pages/Referee/Referee";

// Admin partials
import Users from "./pages/Admin/partials/Users/Users";
import Person from "./pages/Admin/partials/Person/Person";
import Referees from "./pages/Admin/partials/Referee/Referee";
import Coach from "./pages/Admin/partials/Coach/Coach";
import Player from "./pages/Admin/partials/Player/Player";
import AdminClubs from "./pages/Admin/partials/Clubs/Clubs";
import City from "./pages/Admin/partials/City/City";
import League from "./pages/Admin/partials/League/League";
import Competition from "./pages/Admin/partials/Competition/Competition";
import Team from "./pages/Admin/partials/Team/Team";
import Gameplace from "./pages/Admin/partials/Gameplace/Gameplace";
import Game from "./pages/Admin/partials/Game/Game";
import Welcome from "./pages/Admin/partials/WelcomeAdmin/Welcome";
import Roles from "./pages/Admin/partials/Roles/Roles";
import Seasons from "./pages/Admin/partials/Seasons/Seasons";
import AuthRefereeGuard from "./AuthRefereeGuard";
import PrivacyPolicy from "./pages/PrivacyPolicy/PrivacyPolicy";
import ValidateAccount from "./pages/Login/partials/validate-account/ValidateAccount";

function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Home />} />
          <Route path="competitions/:competition/:category" element={<ShowCompetition />} />
          <Route path="competitions" element={<Competitions />} />
          <Route path="clubs" element={<Clubs />} />
          <Route path="clubs/:id" element={<ClubView />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        <Route path="admin" element={<AuthGuard><Admin /></AuthGuard>}>
          <Route path="" element={<Welcome />}></Route>
          <Route path="users" element={<Users />} />
          <Route path="roles" element={<Roles />} />
          <Route path="person" element={<Person />} />
          <Route path="referee" element={<Referees />} />
          <Route path="coach" element={<Coach />} />
          <Route path="player" element={<Player />} />
          <Route path="clubs" element={<AdminClubs />} />
          <Route path="city" element={<City />} />
          <Route path="league" element={<League />} />
          <Route path="competition" element={<Competition />} />
          <Route path="team" element={<Team />} />
          <Route path="gameplace" element={<Gameplace />} />
          <Route path="seasons" element={<Seasons />} />
          <Route path="game" element={<Game />} />
        </Route>
        <Route path="*" element={<Error />} />
        <Route path="referee" element={<AuthRefereeGuard><Referee /></AuthRefereeGuard>} />
        <Route path="login" element={<Login />} />
        <Route path="validate-account/:token" element={<ValidateAccount />} />
        <Route path="privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Index;
