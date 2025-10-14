import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Library from './pages/Library';
import Editor from './pages/Editor';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Library />} />
        <Route path="/editor/:storyId?" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
