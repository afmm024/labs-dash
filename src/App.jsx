import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import { RecoilRoot } from 'recoil';
import Notifications from './components/notifications/notifications';
import { ReactSession } from 'react-client-session';

// ----------------------------------------------------------------------

export default function App() {
  ReactSession.setStoreType("cookie");
  return (
    <HelmetProvider>
      <RecoilRoot>
      <BrowserRouter>
        <ThemeProvider>
          <Notifications />
          <ScrollToTop />
          <StyledChart />
          <Router />
        </ThemeProvider>
      </BrowserRouter>
      </RecoilRoot>
    </HelmetProvider>
  );
}
