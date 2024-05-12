import React from 'react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { Outlet } from 'react-router-dom';

function RootLayout() {
  return (
    <div>
 
    <Header />

  <div style={{minHeight:"70vh"}}>
    <Outlet />
  </div>
  <Footer />
</div>

  );
}

export default RootLayout;
