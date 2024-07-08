import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import {HashRouter, Route, Routes} from 'react-router-dom';
import AuthLayout from './views/auth/signIn';
import RegisterLayout from './views/auth/sign-up';
import ReportsLayout from './layouts/reports';
import DashboardLayout from './layouts/dashboard';
import ProfileLayout from './layouts/profile';
import ErrorNotFound from './layouts/not_found';
import HomePage from './views/homePage';
import {ChakraProvider} from '@chakra-ui/react';
import theme from './theme/theme';
import {ThemeEditorProvider} from '@hypertheme-editor/chakra-ui';

ReactDOM.render(
    <ChakraProvider theme={theme}>
        <React.StrictMode>
            <ThemeEditorProvider>
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<HomePage/>}/>
                        <Route path="/dashboard" element={<DashboardLayout/>}/>
                        <Route path="/reports" element={<ReportsLayout/>}/>
                        <Route path="/report/:reportId" element={<DashboardLayout/>}/>
                        <Route path="/sign-in" element={<AuthLayout/>}/>
                        <Route path="/register" element={<RegisterLayout/>}/>
                        <Route path="/profile" element={<ProfileLayout/>}/>
                        <Route path="*" element={<ErrorNotFound />} />
                    </Routes>
                </HashRouter>
            </ThemeEditorProvider>
        </React.StrictMode>
    </ChakraProvider>,
    document.getElementById('root')
);
