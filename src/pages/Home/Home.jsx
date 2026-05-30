import { Link } from "react-router-dom";
import Hero from "./Hero";
import Categories from "./Categories";
import Services from "./Services";
import Offers from "./Offers";
import "./Home.css";
function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Services />
      <Offers />
      
    </>
  );
}

export default Home;