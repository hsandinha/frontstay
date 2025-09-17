import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Invest from './components/Invest';
import Services from './components/Services';
import UpcomingLaunches from './components/UpcomingLaunches';
import DesignByFront from './components/DesignByFront';
import GestaoByFront from './components/GestaoByFront';
import Amenities from './components/Amenities';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

const HomePage = () => {
  return (
    <div>
      <Header />
      <main>
        <Hero />
        <About />
        <Invest />
        <Services />
        <UpcomingLaunches />
        <GestaoByFront />
        <Amenities />
        <DesignByFront />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;