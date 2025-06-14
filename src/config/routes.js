import Home from '@/components/pages/Home';
import Settings from '@/components/pages/Settings';

export const routes = {
  home: {
    id: 'home',
    path: '/',
    component: Home,
    name: 'Home'
  },
  settings: {
    id: 'settings',
    path: '/settings',
    component: Settings,
    name: 'Settings'
  }
};

export const routeArray = Object.values(routes);