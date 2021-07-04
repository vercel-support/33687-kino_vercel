import React from 'react';
import { Helmet } from 'react-helmet-async';
import Favorite from './Home/Favorite';

const Home = () => {
    return (
        <div>
            <Helmet>
                <title>{`Привет, это Дядька в кино!`}</title>
            </Helmet>
            <Favorite />
        </div>
    )
}

export default Home
