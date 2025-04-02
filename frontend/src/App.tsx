import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { DashboardPage } from './pages/DashboardPage';
import { InvoicesPage } from './pages/InvoicesPage';

const App: React.FC = () => {

  return (
    <Router>
      <AppBar position="static" sx={{ marginBottom: 1 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            FATURAS ENERGIA
          </Typography>
          <Button color="inherit" component={Link} to="/">
            Dashboard
          </Button>
          <Button color="inherit" component={Link} to="/invoices">
            Faturas
          </Button>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
      </Routes>
    </Router>
  );
};

export default App;
