import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { I18nProvider } from './lib/i18n';
import { Shell } from './components/layout/Shell';

// Pages
import { Home } from './pages/Home';
import { Pavilions } from './pages/Pavilions';
import { Restaurants } from './pages/Restaurants';
import { Queue } from './pages/Queue';
import { Chat } from './pages/Chat';
import { SmartRoute } from './components/SmartRoute';
import { NotFound } from './pages/not-found';

const queryClient = new QueryClient();

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/pavilions" component={Pavilions} />
        <Route path="/restaurants" component={Restaurants} />
        <Route path="/queue" component={Queue} />
        <Route path="/chat" component={Chat} />
        <Route path="/smart-route" component={SmartRoute} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
