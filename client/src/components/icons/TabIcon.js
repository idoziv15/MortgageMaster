import React from 'react';
import {Helmet} from 'react-helmet';
import favicon from '../../assets/img/sideBarLogo.png';

const Favicon = () => {
    return (
        <Helmet>
            <link rel="icon" type="image/png" href={favicon} sizes="16x16"/>
        </Helmet>
    );
};

export default Favicon;
