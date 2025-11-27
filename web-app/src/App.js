import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Chatbot from './components/Chatbot';
import Dashboard from './components/Dashboard';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('chatbot');

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <img src="/logo-agribank.png" alt="Agribank Logo" className="logo" />
            <div className="title-section">
              <h1>AGRIBANK DIGITAL GUARD</h1>
              <p>🛡️ Hệ thống Chatbot Phòng chống Lừa đảo</p>
            </div>
          </div>
          <nav className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'chatbot' ? 'active' : ''}`}
              onClick={() => setActiveTab('chatbot')}
            >
              💬 Chatbot
            </button>
            <button
              className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              📊 Dashboard
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {activeTab === 'chatbot' ? <Chatbot /> : <Dashboard />}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2024 Agribank Digital Guard - Hệ thống AI Phòng chống Lừa đảo</p>
        <p>Powered by Gemini AI | Version 1.0.0</p>
      </footer>
    </div>
  );
}

export default App;
