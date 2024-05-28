import { Routes, Route, Link } from "react-router-dom";
import BookShelf from "./bookShelf";
import SignUp from "./signUp";
import Login from "./login";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SignUp/>} />
        <Route path="/logIn" element={<Login/>} />
        <Route path="login/bookShelf" element={<BookShelf/>} />
      </Routes>
    </div>
  );
}

export default App;
