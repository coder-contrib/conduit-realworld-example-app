import { Outlet } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ThemeColorPicker from "./components/ThemeColorPicker";

function App() {
  return (
    <>
      <header>
        <Navbar />
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <Footer />
      </footer>
      <ThemeColorPicker />
    </>
  );
}

export default App;