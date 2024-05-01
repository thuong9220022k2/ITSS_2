import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import Messenger from './pages/Messenger/Messenger.jsx';
import './style.scss';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useCallback, useContext } from 'react';
// import { AuthContext } from './context/AuthContext';

import AddPost from './components/AddPost/AddPost';
import Layout from './pages/Layout/index.jsx';
import MyProfile from './pages/MyProfile/MyProfile.jsx';
import ApprovePost from './pages/ApprovePost/ApprovePost.jsx';
import EditPost from './components/EditPost/EditPost.jsx';
import Profile from './pages/Profile/Profile.jsx';
function App() {
    // const { currentUser } = useContext(AuthContext);

    // const ProtectedRoute = useCallback(({ children }) => {
    //     console.log('protected route',currentUser)
    //     console.log('currentUser route',currentUser)
    //     if (!currentUser || !currentUser?.uid) {
    //         return <Navigate to='/login' />;
    //     }

    //     return children;
    // },[currentUser])

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path='/'
                    element={
                        // <ProtectedRoute>
                        //     <Layout />
                        // </ProtectedRoute>
                        <Layout />
                    }
                >
                    <Route path='create-post' element={<AddPost />} />
                    <Route path='post/:id/edit' element={<EditPost />} />
                    <Route path='approve-post' element={<ApprovePost />} />
                    <Route index path='home' element={<Home />} />
                    <Route path='messenger/' element={<Messenger />} />
                    <Route path='messenger/:id' element={<Messenger />} />
                    <Route path='me' element={<MyProfile />} />
                    <Route path='profile/:id' element={<Profile />} />
                </Route>
                <Route path='login' element={<Login />} />
                <Route path='register' element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
