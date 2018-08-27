import React from 'react';
import Register from "./components/register/Register";
import PhotoList from './components/photo/PhotoList';
import UploadPhoto from './components/UploadPhoto';
import './App.css';

const App = () => (
    <div className="App">
        <header className="App-header">
            <h1 className="App-title">Welcome to Instasham</h1>
        </header>
        <div>
            <Register />
        </div>
        <div>
            <UploadPhoto />
        </div>
        <div>
            <PhotoList />
        </div>
    </div>
);

export default App;
