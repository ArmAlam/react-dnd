import React from 'react';
import ReactDOM from 'react-dom/client';
import { HTML5Backend } from 'react-dnd-html5-backend'
import Example from "./example";
import { DndProvider } from 'react-dnd';
import "./styles.css";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <DndProvider backend={HTML5Backend}>
    <Example />
  </DndProvider>
);

