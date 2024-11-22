import { Link } from 'react-router-dom';
import useTheme from '../hooks/useTheme';

export default function LandingPage() {
  const { themeMode, toggleTheme, resetTheme } = useTheme();

  return (
    <>
      <h1>Landing Page</h1>
      <Link to="/auth">auth</Link>
      <br />
      <Link to="/">home</Link>
      <br />
      <Link to="/new_transaction">new_transaction</Link>
      <br />
      <button onClick={toggleTheme}>
        Toggle Theme (Current: {themeMode === 'auto' ? 'Auto' : themeMode})
      </button>
      <br />
      <button onClick={resetTheme}>Reset to System Theme</button>
    </>
  );
}
