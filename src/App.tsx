import './App.css';
import { PrismaneProvider, TextField } from '@prismane/core';

function App() {
  return (
    <PrismaneProvider>
      <TextField placeholder='enter text' />
    </PrismaneProvider>
  );
}

export default App;
