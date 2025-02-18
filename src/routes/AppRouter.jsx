import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import FavoritesPage from "../pages/FavoritesPage";
import ComicDetailPage from "../pages/ComicDetailPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/comic/:id" element={<ComicDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
