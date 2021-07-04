import React from 'react'
import { observer } from 'mobx-react-lite';
import Layout from '../Store/Layout';

const Container = observer(() => (
    <>
        {Layout?.container && (<div className='fullscreen_container'>
        </div>)
        }
    </>
)
)

export default Container