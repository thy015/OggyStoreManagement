import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

export function App() {
  const ctx = require.context('./app'); // Ensure `app/` directory exists
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
