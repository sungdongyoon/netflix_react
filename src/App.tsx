import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home";
import AllMovies from "./Routes/AllMovies";
import Header from "./Components/Header";

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/movies/:movieId" element={<Home/>} />
        <Route path="/allmovies" element={<AllMovies/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
