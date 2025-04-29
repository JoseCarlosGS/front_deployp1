import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './views/home/Home';
import NotFound from './views/components/NotFound';
import Editor from './views/editor/components/Editor';
import Login from './views/login/Login';
import Register from './views/login/Register';
import ProtectedRoute from './ProtectedRoute';
import GrapesEditor from './views/editor/components/GrapesEditor';

const Router: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="*" element={<NotFound />} />
                <Route path='/login' element={<Login/>} />
                <Route path='/register' element={<Register/>} />
                <Route path= '/grapes' element={<GrapesEditor/>}/>
                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/editor" element={<Editor />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;