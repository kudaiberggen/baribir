import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./components/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Events from "../src/pages/Events";
import Contact from "../src/pages/Contact";
import About from "../src/pages/About";
import CreateEvent from "../src/pages/CreateEvent";
import AboutEvent from "../src/pages/AboutEvent";
import Registration from "../src/pages/Registration";
import Login from "../src/pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import MyProfile from "./pages/MyProfile";
import MyEvents from "./pages/MyEvents";
import Friends from "./pages/Friends";
import Settings from "./pages/Settings";
import FriendProfile from "./pages/FriendProfile";
import ScrollToTop from "./components/ScrollToTop";
import ChatFloatingButton from "./components/ChatFloatingButton";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/events/:eventId" element={<AboutEvent />} />
          <Route path="/registration" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/my-profile" element={<MyProfile />} />
          <Route path="/my-events" element={<MyEvents />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/friend/:friendId" element={<FriendProfile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <ChatFloatingButton />
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
