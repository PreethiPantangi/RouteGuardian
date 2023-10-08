import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <div className="border shadow-md p-5 border-slate-400 flex flex-wrap justify-between">
            <div className='flex space-x-2'>
                <img 
                    src='https://previews.123rf.com/images/roxanabalint/roxanabalint1702/roxanabalint170200164/70883762-be-safe-drive-smart-vintage-rusty-metal-sign-on-a-white-background-vector-illustration.jpg'
                    alt='Be Safe, Drive Smart'
                    width={50}
                    height={50}
                />
                <div className="font-bold text-left mt-3">Drive Smart</div>
            </div>
            <ul className="flex space-x-5">
                <li className="cursor-pointer font-bold hover:text-blue-400"><Link to="/">Map</Link></li>
                <li className="cursor-pointer font-bold hover:text-blue-400"><Link to="/heatMap">Heat Map</Link></li>
            </ul>
        </div>
    )
}

export default Header;
