import React, { lazy, Suspense, useState } from "react";
import Navbar from "./component/Navbar/Navbar";
import Sidebar from "./component/Sidebar/Sidebar";
import { Route, Routes } from "react-router-dom";
import { SidebarProvider } from "./context/SidebarContext";
import LoadingSpinner from "./component/LoadingSpinner/LoadingSpinner";
import Home from "./pages/Home/Home";

// Code-split pages that aren't needed on initial load
const Video = lazy(() => import("./pages/Video/Video"));
const SearchResults = lazy(() => import("./pages/SearchResults/SearchResults"));

const AppContent = () => {
  const [category, setCategory] = useState(0);

  return (
    <div>
      <Navbar />
      <Sidebar category={category} setCategory={setCategory} />
      <Suspense fallback={<LoadingSpinner fullPage message="Loading page..." />}>
        <Routes>
          <Route path="/" element={<Home category={category} />} />
          <Route path="/video/:categoryId/:videoId" element={<Video />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </Suspense>
    </div>
  );
};

const App = () => {
  return (
    <SidebarProvider>
      <AppContent />
    </SidebarProvider>
  );
};

export default App;
