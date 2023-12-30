import './App.css';

import Login from './Components/Login';
import Dashboard from './Components/Dashboard';
import Home from './Components/userInterface/Screens/Home';
import Post from './Components/userInterface/Screens/Post';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Login />} path="/login" />
          <Route element={<Dashboard />} path="/dashboard/*" />
          <Route element={<Post />} path="/post" />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
