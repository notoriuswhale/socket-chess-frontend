import React from "react";
import './HomePage.css';
import {Link} from "react-router-dom";


const HomePage = (props) => {
    return (
        <div className={'home-page'}>
            <header className="section-header">
                <h1 className="header-primary">React Chess Game</h1>
            </header>

            <main className="section-main">
                <nav className="navigation">
                    <ul className="navigation__list">
                        <Link className='navigation__link' to='/game?room=base' >New Game</Link>
                    </ul>
                </nav>
            </main>
        </div>
    );
};


export {HomePage};