import React from 'react';
import './Header.css';

const Header = ({ text }) => <p className="Header">{text ? text : null}</p>;

export default Header;
