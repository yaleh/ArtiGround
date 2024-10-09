import React from 'react';
import { Sandpack } from "@codesandbox/sandpack-react";

const SandpackEditor = () => {
  return (
    <Sandpack
      template="react"
      files={{
        "/App.js": `
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CounterAndCalendar = () => {
  const [count, setCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);

  return (
    <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', maxWidth: '300px', margin: '0 auto' }}>
      <h2>React Counter and Calendar</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '24px', margin: '20px 0' }}>Count: {count}</p>
        <button 
          onClick={decrement}
          style={{ fontSize: '18px', margin: '0 10px', padding: '5px 10px' }}
        >
          -
        </button>
        <button 
          onClick={increment}
          style={{ fontSize: '18px', margin: '0 10px', padding: '5px 10px' }}
        >
          +
        </button>
      </div>

      <div>
        <h3>Select a Date</h3>
        <DatePicker
          selected={selectedDate}
          onChange={date => setSelectedDate(date)}
          dateFormat="MMMM d, yyyy"
          style={{ width: '100%', padding: '10px', fontSize: '16px' }}
        />
        <p>Selected Date: {selectedDate.toDateString()}</p>
      </div>
    </div>
  );
};

export default CounterAndCalendar;
`,
        "/package.json": `
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-scripts": "^5.0.0",
    "react-datepicker": "^4.8.0"
  },
  "devDependencies": {}
}
`
      }}
      options={{
        showNavigator: true,
        showTabs: true,
      }}
    />
  );
};

export default SandpackEditor;