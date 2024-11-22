import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import './App.css';
import RadioSelector from '../components/RadioSelector';
import { reset, setDefaultFamilyId } from '../store/userSlice';
import { RootState } from '../store';
import { Family } from '../types/apiSchemas';

function App() {
  const dispatch = useDispatch();

  const { families }: { families: Family[] } = useSelector(
    (state: RootState) => state.user.user
  );
  const [familyId, setFamilyId] = useState<string>();

  useEffect(() => {
    if (familyId) dispatch(setDefaultFamilyId({ defaultFamilyId: familyId }));
  }, [dispatch, families, familyId]);

  return (
    <>
      <h1>App</h1>
      <RadioSelector
        name="families"
        legend="Chose Family"
        items={families}
        onChange={({ target: { value } }) => setFamilyId(value)}
      />
      <h3>
        selected family name:
        {families.find((family) => family._id === familyId)?.name}
      </h3>

      <Link to="/new-transaction">new-transaction</Link>
      <br />
      <button onClick={() => dispatch(reset())}>log out</button>
    </>
  );
}

export default App;

// <>
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src={viteLogo} className="logo" alt="Vite logo" />
//     </a>
//     <a href="https://react.dev" target="_blank">
//       <img src={reactLogo} className="logo react" alt="React logo" />
//     </a>
//   </div>
//   <h1>Vite + React</h1>
//   <div className="card">
//     <button onClick={() => setCount((count) => count + 1)}>
//       count is {count}
//     </button>
//     <p>
//       Edit <code>src/App.tsx</code> and save to test HMR
//     </p>
//   </div>
//   <p className="read-the-docs">
//     Click on the Vite and React logos to learn more
//   </p>
// </>
