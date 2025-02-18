import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import FavoritePage from "../pages/FavoritePage";
import ComicDetailPage from "../pages/ComicDetailPage";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/favorite" element={<FavoritePage />} />
        <Route path="/comic/:id" element={<ComicDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
