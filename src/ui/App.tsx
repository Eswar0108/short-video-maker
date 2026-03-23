import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VideoList from './pages/VideoList';
import VideoCreator from './pages/VideoCreator';
import VideoDetails from './pages/VideoDetails';
import BulkGeneration from './pages/BulkGeneration';
import ProScriptGenerator from './pages/ProScriptGenerator';
import WorkflowGenerator from './pages/WorkflowGenerator';
import Layout from './components/Layout';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<VideoList />} />
          <Route path="/create" element={<VideoCreator />} />
          <Route path="/bulk" element={<BulkGeneration />} />
          <Route path="/pro-scripts" element={<ProScriptGenerator />} />
          <Route path="/workflow" element={<WorkflowGenerator />} />
          <Route path="/video/:videoId" element={<VideoDetails />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App; 