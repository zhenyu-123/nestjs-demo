import { useState } from 'react';
import Login from './components/Login/Login';
import Upload from './components/Upload/Upload';
import DownLoad from './components/DownLoad/DownLoad';
import TabelCrud from './components/TabelCrud/TabelCrud';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h3>图片验证码</h3>
      <Login />
      <h3>上传</h3>
      <Upload></Upload>
      <h3>流式下载</h3>
      <DownLoad></DownLoad>
      <h3>表格的增删改查</h3>
      <TabelCrud></TabelCrud>
    </>
  );
}

export default App;
