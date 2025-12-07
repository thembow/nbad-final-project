import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';

// --- Global Config ---
const API_URL = 'http://localhost:3000';

// --- Components ---

// 1. Navigation Bar
const Navbar = ({ onLogout }) => (
  <nav style={styles.nav} aria-label="Main Navigation">
    <div style={styles.navBrand} role="heading" aria-level="1">E71 Healthcare App</div>
    <div style={styles.navLinks}>
      <Link to="/dashboard" style={styles.link}>Dashboard</Link>
      <Link to="/summary" style={styles.link}>Summary</Link>
      <Link to="/reports" style={styles.link}>Reports</Link>
      <button 
        onClick={onLogout} 
        style={styles.logoutBtn}
        aria-label="Log out of application"
      >
        Logout
      </button>
    </div>
  </nav>
);

// 2. Login Page
const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/login`, { username, password });
      const token = res.data.token;
      localStorage.setItem('token', token);
      setToken(token);
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <main style={styles.centerContainer}>
      <section style={styles.card} aria-labelledby="login-heading">
        <h2 id="login-heading">Login</h2>
        <div role="alert" aria-live="polite">
          {error && <p style={{ color: '#d32f2f', fontWeight: 'bold' }}>{error}</p>}
        </div>
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label htmlFor="username" style={styles.label}>Username</label>
            <input 
              id="username"
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label htmlFor="password" style={styles.label}>Password</label>
            <input 
              id="password"
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>Sign In</button>
        </form>
      </section>
    </main>
  );
};

// 3. Dashboard Page
const Dashboard = () => (
  <main style={styles.pageContainer}>
    <h1>Executive Dashboard</h1>
    <article style={styles.card}>
      <h2>Topic: Innovations in Healthcare</h2>
      <p style={styles.text}>
        There are many emerging innovations in the healthcare sector, specifically those poised to transform care delivery over the next decade.
        The primary driver for this shift appears to be the industry's need to achieve "more for less"—enhancing value and outcomes while simultaneously reducing costs.
        Key factors in driving this transformation include the transition from fee-for-service models to value-based care, as well as the rising influence of consumerism and data availability.
      </p>
      <p style={styles.text}>
        Technological advancements such as next-generation sequencing and immunotherapy are highlighted as critical for enabling highly targeted, personalized treatments.
         Interestingly, the integration of digital tools like artificial intelligence and biosensors is seen not just as an operational improvement, but as a fundamental change in how patient health is monitored and managed. 
         The analysis also suggests that care delivery is moving beyond traditional settings, with telehealth and retail clinics playing a larger role in improving access. 
         It is predicted that as these innovations mature, successful organizations will be those that build ecosystems to embrace these non-traditional data sources and care platforms. 
         In particular, the use of 3D printing and AI in healthcare are worth focusing on, as 3D printing allows for custom designed healthcare technology and AI helps to ensure patients and caretakers are properly prioritized.
      </p>
      <p style={{marginTop: '15px', fontStyle: 'italic', fontSize: '0.9em'}}>
        Source: <a href="https://www.deloitte.com/us/en/Industries/life-sciences-health-care/articles/top-10-health-care-innovations.html" target="_blank" rel="noreferrer" aria-label="Read source article at Deloitte">Deloitte</a>
      </p>
    </article>
    <article style={styles.card}>
      <h2>Technical Architecture</h2>
      <p style={styles.text}>
        This application acts as a Single Page Application (SPA) built with React.js (Vite). 
        It communicates with a decoupled RESTful API backend built on Node.js and Express. 
        Authentication is handled via JSON Web Tokens (JWT), ensuring stateless and secure validation of requests. 
        Data persistence is managed by a MySQL database running on an Ubuntu VPS, served via NGINX. 
        The frontend visualizes asynchronous data using the Recharts library, ensuring accessible and responsive data storytelling.
      </p>
    </article>
  </main>
);

// 4. Summary Page (Updated with text block)
const Summary = ({ token }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/chart/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [token]);

  return (
    <main style={styles.pageContainer}>
      <h1>AI Adoption Priorities in Healthcare</h1>
      <section 
        style={{...styles.card, height: '500px'}} 
        aria-label="Bar chart showing priorities for AI adoption in healthcare"
        role="img"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 50, right: 30, top: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" width={150} style={{fontSize: '12px'}} />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" name="% of Respondents" barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </section>
      
      {/* New Text Block for Summary Page */}
      <article style={styles.card}>
        <h3>Chart Analysis</h3>
        <p style={styles.text}>
          This chart is taken from a 2024 survey of Healthcare systems and health system leaders regarding AI adoption.
          Respondents were asked what their top priorities were for implementing AI technologies in their organizations.
          Focus on caregivers burden, patient safety, and efficiency improvements were the most cited reasons.
          Financial improvement and was seen as a lower priority, but surpisingly still more of a focus than patient satisfication.
          Interestingly, none of the surveyed organizations stated that market competitiveness was a driver for AI adoption,
          indicating that internal operational benefits are outweighing external pressures in this space.
        </p>
        <p style={styles.text}>
          Source: <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC12202002/#sup1" target="_blank" rel="noreferrer" style={{color: '#0056b3'}}>Poon et al.</a>
        </p>
      </article>
    </main>
  );
};

// 5. Reports Page (Updated with text block)
const Reports = ({ token }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/chart/reports`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => setData(res.data))
      .catch(err => console.error(err));
  }, [token]);

  return (
    <main style={styles.pageContainer}>
      <h1>3D Printing in Healthcare Market Size Growth (2025-2034)</h1>
      <section 
        style={{...styles.card, height: '500px'}}
        aria-label="Area chart showing steady growth of 3D printing market"
        role="img"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 10, right: 30, top: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="value" stroke="#82ca9d" fill="#82ca9d" name="Market Size (USD Billions)" />
          </AreaChart>
        </ResponsiveContainer>
      </section>

      {/* New Text Block for Reports Page */}
      <article style={styles.card}>
        <h3>Chart Analysis</h3>
        <p style={styles.text}>
          This chart is taken from a market report on the projected growth of the 3D printing market in healthcare, from Precendence Research.
          The authors note that the market size is already substantial in 2025 at nearly $2 billion USD, and they expect it to continue growing steadily.
          Key factors in driving this growth appear to be 3D printing's ability to create highly customized medical devices, as well as advancements in
          utilization in the pharamaceutical and bioprinting sectors. 
          The authors also note that the amount of people suffering from chronic diseases is a major driver for demand of 3D printed solutions.
          The report predicts that as these technologies mature and regulatory pathways become clearer, the market share could increase to over $8 billion USD by 2034.

        </p>
        <p style={styles.text}>
          Source: <a href="https://www.precedenceresearch.com/3d-printing-in-healthcare-market" target="_blank" rel="noreferrer" style={{color: '#0056b3'}}>Precedence Research</a>
        </p>
      </article>
    </main>
  );
};

// 6. Protected Route Wrapper
const ProtectedRoute = ({ token, children }) => {
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

// --- Main App Component ---
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <Router>
      <div className="App" style={{ fontFamily: 'Arial, sans-serif' }}>
        {token && <Navbar onLogout={handleLogout} />}
        <Routes>
          <Route 
            path="/" 
            element={token ? <Navigate to="/dashboard" replace /> : <Login setToken={setToken} />} 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute token={token}>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/summary" 
            element={
              <ProtectedRoute token={token}>
                <Summary token={token} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute token={token}>
                <Reports token={token} />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

// --- Styles ---
const styles = {
  nav: {
    background: '#2c3e50',
    padding: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white'
  },
  navBrand: { fontSize: '1.2rem', fontWeight: 'bold' },
  navLinks: { display: 'flex', gap: '20px' },
  link: { color: 'white', textDecoration: 'none', fontSize: '1.1rem' },
  logoutBtn: { 
    background: 'transparent', 
    border: '1px solid white', 
    color: 'white', 
    padding: '8px 16px', 
    cursor: 'pointer', 
    fontSize: '1rem',
    borderRadius: '4px'
  },
  pageContainer: { padding: '2rem', maxWidth: '1000px', margin: '0 auto' },
  centerContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f2f5' },
  card: { 
    background: 'white', 
    padding: '2rem', 
    borderRadius: '8px', 
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
    marginBottom: '20px', 
    color: '#222' 
  },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', minWidth: '300px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontWeight: 'bold', fontSize: '0.9rem', color: '#333' },
  input: { padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #777' },
  button: { padding: '12px', background: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' },
  text: { lineHeight: '1.6', marginBottom: '15px', fontSize: '1.1rem' },
  caption: { textAlign: 'center', color: '#444', marginTop: '10px', fontStyle: 'italic' }
};

export default App;