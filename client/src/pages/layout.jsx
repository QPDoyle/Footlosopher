import './index.css';

function Layout({ children }) {
  return (
    <div className="app">
      <div className="noise" />
      <header className="header">
        {/* your shared nav here */}
      </header>
      <main className="main">
        {children}
      </main>
    </div>
  );
}

export default Layout;