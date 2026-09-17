import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Library from './pages/Library';
import Editor from './pages/Editor';
import PhotoEditorTest from './pages/PhotoEditorTest';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Library />} />
        <Route path="/editor/:storyId?" element={<Editor />} />
        <Route path="/test-editor" element={<PhotoEditorTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
