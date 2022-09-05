import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Staff from './features/staff/Staff';
import HomePage from './pages/Home';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />}>
          <Route path="/departments/:departmentId" element={<Staff />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
