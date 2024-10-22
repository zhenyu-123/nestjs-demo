import { useState } from 'react';
import Login from './components/Login/Login';
import Upload from './components/Upload/Upload';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Login />
      <Upload></Upload>
    </>
  );
}

export default App;
