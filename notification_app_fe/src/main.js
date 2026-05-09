// notification_app_fe/src/App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';

// Simple log function for frontend
const log = async (stack, level, packageName, message) => {
    try {
        await fetch('http://localhost:3000/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stack, level, package: packageName, message })
        });
    } catch (error) {
        console.log(`[${level}] ${message}`);
    }
};

function App() {
    const [notifications, setNotifications] = useState([]);
    const [priorityList, setPriorityList] = useState([]);
    const [limit, setLimit] = useState(10);
    const [filterType, setFilterType] = useState('all');
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [readIds, setReadIds] = useState(new Set());

    useEffect(() => {
        log("frontend", "info", "page", "App component mounted");
        fetchNotifications();
    }, []);

    useEffect(() => {
        calculatePriority();
    }, [notifications, limit]);

    const fetchNotifications = async () => {
        setLoading(true);
        log("frontend", "info", "api", "Fetching notifications from backend");
        
        try {
            const response = await fetch('http://localhost:3000/api/notifications');
            const data = await response.json();
            
            setNotifications(data);
            log("frontend", "info", "api", `Fetched ${data.length} notifications`);
        } catch (error) {
            log("frontend", "error", "api", `Failed to fetch: ${error.message}`);
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const calculatePriority = () => {
        log("frontend", "debug", "state", "Recalculating priority scores");
        
        const weights = {
            'Placement': 100,
            'Result': 50,
            'Event': 10
        };
        
        const withPriority = notifications.map(notif => {
            const weight = weights[notif.Type] || 0;
            const notifTime = new Date(notif.Timestamp.replace(' ', 'T'));
            const now = new Date();
            const hoursDiff = (now - notifTime) / (1000 * 60 * 60);
            const recency = Math.max(0, 100 - hoursDiff * 2);
            
            return {
                ...notif,
                priorityScore: weight + recency,
                isRead: readIds.has(notif.ID)
            };
        });
        
        const sorted = withPriority.sort((a, b) => b.priorityScore - a.priorityScore);
        setPriorityList(sorted.slice(0, limit));
    };

    const markAsRead = (id) => {
        log("frontend", "info", "component", `Marking notification ${id} as read`);
        setReadIds(prev => new Set([...prev, id]));
    };

    const getFilteredNotifications = () => {
        let filtered = notifications;
        
        if (filterType !== 'all') {
            filtered = notifications.filter(n => n.Type === filterType);
            log("frontend", "debug", "state", `Filtered by type: ${filterType}`);
        }
        
        const start = (currentPage - 1) * 10;
        return filtered.slice(start, start + 10);
    };

    const pages = Math.ceil(notifications.filter(n => filterType === 'all' || n.Type === filterType).length / 10);

    return (
        <div className="app">
            <header className="header">
                <h1>📢 Campus Notifications</h1>
                <p>Stay updated with placements, results, and events</p>
            </header>

            <div className="priority-section">
                <h2>⭐ Priority Inbox (Top {limit})</h2>
                <div className="limit-control">
                    <label>Show top: </label>
                    <select value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
                        <option value={10}>10</option>
                        <option value={15}>15</option>
                        <option value={20}>20</option>
                    </select>
                </div>
                
                <div className="notifications-list">
                    {priorityList.map(notif => (
                        <div key={notif.ID} className={`notification-card ${notif.isRead ? 'read' : 'unread'}`}>
                            <div className={`type-badge ${notif.Type.toLowerCase()}`}>
                                {notif.Type}
                            </div>
                            <div className="message">{notif.Message}</div>
                            <div className="timestamp">{notif.Timestamp}</div>
                            <div className="score">Priority: {Math.round(notif.priorityScore)}</div>
                            {!notif.isRead && (
                                <button onClick={() => markAsRead(notif.ID)} className="mark-read">
                                    Mark as Read
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="all-section">
                <h2>📋 All Notifications</h2>
                
                <div className="filters">
                    <button onClick={() => setFilterType('all')} className={filterType === 'all' ? 'active' : ''}>
                        All
                    </button>
                    <button onClick={() => setFilterType('Placement')} className={filterType === 'Placement' ? 'active' : ''}>
                        Placements
                    </button>
                    <button onClick={() => setFilterType('Result')} className={filterType === 'Result' ? 'active' : ''}>
                        Results
                    </button>
                    <button onClick={() => setFilterType('Event')} className={filterType === 'Event' ? 'active' : ''}>
                        Events
                    </button>
                </div>

                {loading ? (
                    <div className="loading">Loading...</div>
                ) : (
                    <>
                        <div className="notifications-list">
                            {getFilteredNotifications().map(notif => (
                                <div key={notif.ID} className="notification-card">
                                    <div className={`type-badge ${notif.Type.toLowerCase()}`}>
                                        {notif.Type}
                                    </div>
                                    <div className="message">{notif.Message}</div>
                                    <div className="timestamp">{notif.Timestamp}</div>
                                </div>
                            ))}
                        </div>

                        <div className="pagination">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
                                Previous
                            </button>
                            <span>Page {currentPage} of {pages}</span>
                            <button disabled={currentPage === pages} onClick={() => setCurrentPage(p => p + 1)}>
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;