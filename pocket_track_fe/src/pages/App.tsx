import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './App.css';
import RadioSelector from '../components/RadioSelector';
import { reset, setDefaultFamilyId } from '../store/userSlice';
import { RootState } from '../store';
import { Family, User } from '../types/apiSchemas';
import useTheme from '../hooks/useTheme';

function App() {
  const dispatch = useDispatch();

  const { user, defaultFamilyId }: { user: User; defaultFamilyId: string } =
    useSelector((state: RootState) => state.user);

  const families: Family[] = useMemo(() => user?.families || [], [user]);

  const [familyId, setFamilyId] = useState<string>();

  useEffect(() => {
    if (familyId) dispatch(setDefaultFamilyId({ defaultFamilyId: familyId }));
  }, [dispatch, families, familyId]);

  const { themeMode, toggleTheme, resetTheme } = useTheme();

  if (!families || families.length === 0) {
    return <p>Loading families...</p>; // Messaggio o loader durante il caricamento
  }

  return (
    <>
      <h1>App</h1>
      <RadioSelector
        name="families"
        legend="Chose Family"
        items={families}
        onChange={({ target: { value } }) => setFamilyId(value)}
        defaultValue={defaultFamilyId}
      />
      <h3>
        selected family name:
        {families.find((family) => family._id === familyId)?.name}
      </h3>

      <Link to="/new_transaction">new_transaction</Link>
      <br />
      <button onClick={() => dispatch(reset())}>log out</button>
      <br />
      <button onClick={toggleTheme}>
        Toggle Theme (Current: {themeMode === 'auto' ? 'Auto' : themeMode})
      </button>
      <br />
      <button onClick={resetTheme}>Reset to System Theme</button>
    </>
  );
}

export default App;
