import React from 'react';
import './App.css';
import CourierManagement from './components/CourierManagement';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Управление курьерами</h1>
        <p>Система распределения работы курьеров службы доставки</p>
      </header>
      <main>
        <CourierManagement />
      </main>
    </div>
  );
}

export default App;
