import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/Layout';
import { routes, routeArray } from '@/config/routes';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

function ToastWrapper() {
  const { theme } = useTheme();
  
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={theme}
      className="z-[9999]"
      progressStyle={{ background: 'linear-gradient(90deg, #5B21B6, #8B5CF6)' }}
    />
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {routeArray.map(route => (
              <Route 
                key={route.id}
                path={route.path} 
                element={<route.component />} 
              />
            ))}
            <Route index element={<routes.home.component />} />
          </Route>
        </Routes>
        
        <ToastWrapper />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;