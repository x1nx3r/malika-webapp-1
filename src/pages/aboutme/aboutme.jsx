import Header from "./components/Header";
import AboutHero from "./components/AboutHero";
import WhyChooseUs from "./components/WhyChooseUs";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";

const aboutme = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <AboutHero />
    <WhyChooseUs />
    <Features />
    <Testimonials />
    <Footer />
  </div>
);

export default aboutme;
