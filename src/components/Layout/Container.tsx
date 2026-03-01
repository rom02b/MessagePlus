import React, { type ReactNode } from 'react';
import './Container.css';

interface ContainerProps {
    children: ReactNode;
    className?: string;
}

const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
    return (
        <div className={`app-container ${className}`}>
            <div className="container">
                {children}
            </div>
        </div>
    );
};

export default Container;
