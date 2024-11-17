import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <>
      <h1>Landing Page</h1>
      <Link to="/auth">auth</Link>
    </>
  );
}
