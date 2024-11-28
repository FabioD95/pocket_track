import { useEffect, useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './App.css';
import { reset, setDefaultFamilyId } from '../store/userSlice';
import { RootState } from '../store';
import {
  Family,
  GetFamily,
  GetFamilySchema,
  Item,
  User,
} from '../types/apiSchemas';
import useTheme from '../hooks/useTheme';
import fetchData from '../utils/fetchData';
import ListSelector from '../components/ListSelector';

function App() {
  const dispatch = useDispatch();

  const { user, defaultFamilyId }: { user: User; defaultFamilyId: string } =
    useSelector((state: RootState) => state.user);

  const families: Family[] = useMemo(() => user?.families || [], [user]);

  const [family, setFamily] = useState<Item>();

  useEffect(() => {
    if (family) dispatch(setDefaultFamilyId({ defaultFamilyId: family._id }));
  }, [dispatch, families, family]);

  const createFamily = useCallback(async (name: string) => {
    const response = await fetchData<GetFamily>({
      method: 'post',
      route: 'families',
      schema: GetFamilySchema,
      body: { name },
    });
    return response.family;
  }, []);

  const { themeMode, toggleTheme, resetTheme } = useTheme();

  if (!families || families.length === 0) {
    return <p>Loading families...</p>; // Messaggio o loader durante il caricamento
  }

  return (
    <>
      <h1>App</h1>
      {/* <RadioSelector
        name="families"
        legend="Chose Family"
        items={families}
        onChange={({ target: { value } }) => setFamilyId(value)}
        defaultValue={defaultFamilyId}
      /> */}

      <ListSelector
        items={families}
        createItem={createFamily}
        onItemsChange={(tags) => setFamily(tags[0])}
        allowMultiple={false}
        legend="Family"
        placeholder="Select a family..."
        defaultValue={families.filter(
          (family) => family._id === defaultFamilyId
        )}
      />
      <h3>
        selected family name:
        {families.find((family) => family._id === family._id)?.name}
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
