import { SnackbarProvider } from 'notistack';
import Notifier from './components/notifier';

function Notifications() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Notifier />
    </SnackbarProvider>
  );
}

export default Notifications;