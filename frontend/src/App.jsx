// import { Navbar, Welcome, Footer, Services} from "./components";
import { Navbar, Welcome, Footer} from "./components";

const App = () => (
  <div className="min-h-screen">
    <div className="gradient-bg-welcome">
      <Navbar />
      <Welcome />
    </div>
    {/* <Services /> */}
    <Footer />
  </div>
);

export default App;
