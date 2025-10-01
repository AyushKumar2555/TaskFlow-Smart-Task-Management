// Layout component - provides the basic structure for all pages
// This wraps every page with consistent header and layout
import React from 'react';
import Header from './Header';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header section with navigation and user information */}
      <Header />
      
      {/* Main content area where different pages will be displayed */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;