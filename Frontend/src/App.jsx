import './App.css'
import { BrowserRouter, Routes, Route, } from "react-router-dom";
import Signup from './components/auth/signup'
import Login from './components/auth/login';
import Home from './components/home/home';
import Chat from './components/chat/chat';
import ProtectedRoute from './components/protected/protectedRoute';
import { ChatProvider } from './context/useChatContext.jsx';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/chat"  element={
            <ProtectedRoute>
              <ChatProvider>
                <Chat />
              </ChatProvider>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App