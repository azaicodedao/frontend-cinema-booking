import React from 'react';
import AuthProvider from './app/providers/AuthProvider';
import AppRoutes from './app/routes/AppRoutes';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
