import React from 'react';
import Banner from '../components/Banner';
import Services from '../components/Services';
import Values from '../components/Values';
import SocialFeed from '../components/SocialFeed';

const Home = () => {
  return (
    <div>
      <Banner />
      <Services />
      <Values />
      <SocialFeed />
    </div>
  );
};

export default Home;
