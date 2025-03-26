import React, { useEffect, useState } from 'react';

function SessionTimeout() {
    const [timeElapsed, setTimeElapsed] = useState(0); // Track elapsed time
    const sessionTimeout = 15 * 60 * 1000; // 15 minutes timeout
    const inactivityTimeout = 5 * 60 * 1000; // 5 minutes inactivity

    useEffect(() => {
        const sessionStart = localStorage.getItem('sessionStart') || Date.now();
        localStorage.setItem('sessionStart', sessionStart);

        const updateSessionTime = () => {
            const elapsed = Date.now() - parseInt(sessionStart, 10);
            setTimeElapsed(elapsed);
        };

        const interval = setInterval(updateSessionTime, 1000);

        const handleActivity = () => {
            localStorage.setItem('lastActivity', Date.now());
        };

        const checkInactivity = () => {
            const lastActivity = localStorage.getItem('lastActivity') || Date.now();
            if (Date.now() - parseInt(lastActivity, 10) > inactivityTimeout) {
                logoutUser();
            }
        };

        const logoutUser = () => {
            localStorage.clear();
            alert('Session expired due to inactivity.');
            window.location.href = '/SignIn_VerifyPassword';
        };

        window.addEventListener('mousemove', handleActivity);
        window.addEventListener('keypress', handleActivity);
        const inactivityInterval = setInterval(checkInactivity, 1000);

        if (timeElapsed >= sessionTimeout) {
            logoutUser();
        }

        return () => {
            clearInterval(interval);
            clearInterval(inactivityInterval);
            window.removeEventListener('mousemove', handleActivity);
            window.removeEventListener('keypress', handleActivity);
        };
    }, [timeElapsed]);

    return (
        <div className='bg-success d-flex align-items-center justify-content-between text-white px-3'>
            <p className='fs-5 fw-bold mb-0 text-dark'>Session Time</p>
            <p className='fs-6 mb-0'>Time elapsed: {Math.floor(timeElapsed / 1000)} seconds</p>
            <p className='fs-6 mb-0 text-warning'>Session will expire in: {Math.floor((15 * 60 * 1000 - timeElapsed) / 1000)} seconds</p>
        </div>
    );
}

export default SessionTimeout;
