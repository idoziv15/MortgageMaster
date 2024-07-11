import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import './assets/css/App.css';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
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
import {isAuthenticated} from './components/auth/authenticate';

const App = () => {

    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            const authenticated = await isAuthenticated();
            setAuthenticated(authenticated);
        };

        checkAuthentication();
    }, []);

    return (
        <ChakraProvider theme={theme}>
            <React.StrictMode>
                <ThemeEditorProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/sign-in" element={<AuthLayout/>}/>
                            <Route path="/register" element={<RegisterLayout/>}/>
                            <Route
                                path="/dashboard"
                                element={authenticated ? <DashboardLayout/> : <Navigate to="/sign-in" replace/>}
                            />
                            <Route
                                path="/reports"
                                element={authenticated ? <ReportsLayout/> : <Navigate to="/sign-in" replace/>}
                            />
                            <Route
                                path="/report/:reportId"
                                element={authenticated ? <DashboardLayout/> : <Navigate to="/sign-in" replace/>}
                            />
                            <Route
                                path="/profile"
                                element={authenticated ? <ProfileLayout/> : <Navigate to="/sign-in" replace/>}
                            />
                            <Route path="*" element={<ErrorNotFound/>}/>
                        </Routes>
                    </BrowserRouter>
                </ThemeEditorProvider>
            </React.StrictMode>
        </ChakraProvider>
    );
};

ReactDOM.render(<App/>, document.getElementById('root'));
