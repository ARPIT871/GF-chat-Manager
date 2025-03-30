import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import { FaWhatsapp, FaTimes, FaMoon, FaSun, FaInfoCircle, FaPalette, FaMagic, FaHeart, FaBell, FaCalendarAlt } from 'react-icons/fa';
import './App.css';

// Mock data for chats
const mockChats = [
  { id: 1, name: 'John Doe', lastMessage: 'Sure, I\'ll send you the document shortly.', time: '10:35 AM', unread: 2 },
  { id: 2, name: 'Jane Smith', lastMessage: 'Did you finish that project?', time: '9:47 AM', unread: 0 },
  { id: 3, name: 'Mike Johnson', lastMessage: 'Let\'s meet tomorrow!', time: '3:31 PM', unread: 3 },
  { id: 4, name: 'Sarah Williams', lastMessage: 'Thanks for your help!', time: '11:25 AM', unread: 0 },
  { id: 5, name: 'David Brown', lastMessage: 'Can you share that document?', time: '2:20 PM', unread: 1 },
  { id: 6, name: 'Emma Davis', lastMessage: 'Did you see the news?', time: '5:12 PM', unread: 0 },
  { id: 7, name: 'James Wilson', lastMessage: 'Happy birthday!', time: '9:10 AM', unread: 0 },
];

// Available themes
const THEMES = [
  { 
    id: 'dark-green', 
    name: 'Dark Green',
    primaryColor: '#00BFA5',
    secondaryColor: '#00E676' 
  },
  { 
    id: 'midnight-blue', 
    name: 'Midnight Blue',
    primaryColor: '#3498db',
    secondaryColor: '#2980b9'
  },
  { 
    id: 'royal-purple', 
    name: 'Royal Purple',
    primaryColor: '#9b59b6',
    secondaryColor: '#8e44ad'
  },
  { 
    id: 'ruby-red', 
    name: 'Ruby Red',
    primaryColor: '#e74c3c',
    secondaryColor: '#c0392b'
  },
  { 
    id: 'sunset-orange', 
    name: 'Sunset Orange',
    primaryColor: '#f39c12',
    secondaryColor: '#d35400'
  }
];

function App() {
  const [selectedChats, setSelectedChats] = useState({ left: null, right: null });
  const [showTooltip, setShowTooltip] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a preference stored
    const savedPreference = localStorage.getItem('whatsapp-mini-dark-mode');
    return savedPreference ? JSON.parse(savedPreference) : false;
  });
  const [currentTheme, setCurrentTheme] = useState('dark-green');
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [showReminders, setShowReminders] = useState(false);
  const [reminders, setReminders] = useState([
    { id: 1, name: 'Sophia', event: 'Anniversary Dinner', date: 'Friday, 8:00 PM' },
    { id: 2, name: 'Emma', event: 'Birthday', date: 'Next Tuesday' },
    { id: 3, name: 'Olivia', event: 'Coffee Date', date: 'Tomorrow, 3:00 PM' }
  ]);
  const [chatList, setChatList] = useState([
    { id: 1, name: 'Sophia', lastMessage: 'Miss you! When are we meeting next?', time: '10:30 AM', unread: 2 },
    { id: 2, name: 'Emma', lastMessage: 'Did you get the gift I sent you?', time: '9:42 AM', unread: 0 },
    { id: 3, name: 'Olivia', lastMessage: 'Can\'t wait to see you tomorrow!', time: '3:31 PM', date: 'Yesterday', unread: 0 },
    { id: 4, name: 'Isabella', lastMessage: 'Thinking about you... ❤️', time: '11:22 AM', date: 'Yesterday', unread: 0 },
    { id: 5, name: 'Ava', lastMessage: 'I love the flowers you sent!', time: '2:17 PM', date: 'Monday', unread: 0 },
    { id: 6, name: 'Mia', lastMessage: 'Should I wear the red dress tonight?', time: '5:10 PM', date: 'Sunday', unread: 0 },
    { id: 7, name: 'Charlotte', lastMessage: 'Missing our date night already!', time: '9:05 AM', date: 'Last week', unread: 0 }
  ]);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    // Show tooltip on first visit
    const tooltipShown = localStorage.getItem('tooltip-shown');
    if (!tooltipShown) {
      setShowTooltip(true);
    }

    // Apply dark mode class to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Save dark mode preference
    localStorage.setItem('whatsapp-mini-dark-mode', JSON.stringify(darkMode));

    // Apply theme on initial load and theme change
    const theme = THEMES.find(t => t.id === currentTheme);
    if (theme) {
      document.documentElement.style.setProperty('--primary', theme.primaryColor);
      document.documentElement.style.setProperty('--primary-light', theme.secondaryColor);
      document.documentElement.style.setProperty('--primary-gradient', `linear-gradient(145deg, ${theme.primaryColor}, ${theme.secondaryColor})`);
      
      // Update avatar colors based on the theme
      document.documentElement.style.setProperty('--avatar-1', theme.primaryColor);
      document.documentElement.style.setProperty('--avatar-2', theme.secondaryColor);
    }
  }, [darkMode, currentTheme]);
  
  useEffect(() => {
    // Check if screen width is mobile size (below 768px)
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    // Check on initial load
    checkMobileView();
    
    // Add resize event listener
    window.addEventListener('resize', checkMobileView);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  useEffect(() => {
    // Add a click event listener to the document to close dropdowns when clicking outside
    const handleClickOutside = (e) => {
      const isRemindersButton = e.target.closest('.reminder-btn');
      const isThemeButton = e.target.closest('.text-button[title="Customize Theme"]');
      const isRemindersDropdown = e.target.closest('.reminders-dropdown');
      const isThemePicker = e.target.closest('.theme-picker');
      
      // Close reminders if clicking outside reminders area
      if (!isRemindersButton && !isRemindersDropdown && showReminders) {
        setShowReminders(false);
      }
      
      // Close theme picker if clicking outside theme area
      if (!isThemeButton && !isThemePicker && showThemePicker) {
        setShowThemePicker(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showReminders, showThemePicker]);

  useEffect(() => {
    // Function to handle adding a new chat
    const handleAddNewChat = (event) => {
      const newChat = event.detail;
      setChatList(prevChats => [...prevChats, newChat]);
    };
    
    // Add event listener for custom event
    window.addEventListener('add-new-chat', handleAddNewChat);
    
    // Cleanup
    return () => {
      window.removeEventListener('add-new-chat', handleAddNewChat);
    };
  }, []);

  const handleChatSelect = (chat, position = 'auto') => {
    let newSelectedChats = { ...selectedChats };

    // Handle explicit positioning when arrows are clicked
    if (position === 'left') {
      // If this chat was already on the right, remove it from there
      if (selectedChats.right && selectedChats.right.id === chat.id) {
        newSelectedChats.right = null;
      }
      newSelectedChats.left = chat;
    } 
    else if (position === 'right') {
      // If this chat was already on the left, remove it from there
      if (selectedChats.left && selectedChats.left.id === chat.id) {
        newSelectedChats.left = null;
      }
      newSelectedChats.right = chat;
    }
    else if (position === 'remove-left') {
      newSelectedChats.left = null;
    }
    else if (position === 'remove-right') {
      newSelectedChats.right = null;
    }
    // Auto selection logic for direct chat clicks
    else if (position === 'auto') {
      // If chat is already selected on either side, do nothing
      if ((selectedChats.left && selectedChats.left.id === chat.id) || 
          (selectedChats.right && selectedChats.right.id === chat.id)) {
        return;
      }
      
      // If both sides are filled, replace the left side
      if (selectedChats.left && selectedChats.right) {
        newSelectedChats.left = chat;
      }
      // If left is empty, fill left
      else if (!selectedChats.left) {
        newSelectedChats.left = chat;
      }
      // If right is empty, fill right
      else if (!selectedChats.right) {
        newSelectedChats.right = chat;
      }
    }

    setSelectedChats(newSelectedChats);
    
    // Mark tooltip as shown
    if (showTooltip) {
      setShowTooltip(false);
      localStorage.setItem('tooltip-shown', 'true');
    }
  };

  const closeTooltip = () => {
    setShowTooltip(false);
    localStorage.setItem('tooltip-shown', 'true');
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const applyTheme = (themeId) => {
    setCurrentTheme(themeId);
    setShowThemePicker(false);
    
    const theme = THEMES.find(t => t.id === themeId);
    if (theme) {
      document.documentElement.style.setProperty('--primary', theme.primaryColor);
      document.documentElement.style.setProperty('--primary-light', theme.secondaryColor);
      document.documentElement.style.setProperty('--primary-gradient', `linear-gradient(145deg, ${theme.primaryColor}, ${theme.secondaryColor})`);
    }
  };

  const toggleReminders = (e) => {
    e.stopPropagation();
    setShowReminders(!showReminders);
    if (!showReminders) {
      setShowThemePicker(false); // Close theme picker when opening reminders
    }
  };
  
  const toggleThemePicker = (e) => {
    e.stopPropagation();
    setShowThemePicker(!showThemePicker);
    if (!showThemePicker) {
      setShowReminders(false); // Close reminders when opening theme picker
    }
  };

  return (
    <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
      {isMobileView && (
        <div className="mobile-overlay">
          <div className="mobile-message">
            <FaHeart style={{ color: '#ff6b6b', fontSize: '48px', marginBottom: '16px' }} />
            <h2>GF Chat Manager</h2>
            <p>We're working on a mobile version!</p>
            <p className="mobile-subtitle">Please use a tablet or desktop device for now.</p>
            <div className="coming-soon-badge">Coming Soon</div>
          </div>
        </div>
      )}
      
      <div className="app-header">
        <div className="app-title">
          <FaHeart style={{ color: '#ff6b6b' }} />
          <h1>GF Chat Manager</h1>
        </div>
        <div className="app-actions">
          <button 
            className="text-button reminder-btn"
            onClick={toggleReminders}
            title="Date Reminders"
          >
            Dates
            <span className="reminder-badge">3</span>
          </button>
          <button 
            className="text-button" 
            onClick={toggleThemePicker}
            title="Customize Theme"
          >
            Theme
          </button>
          <button 
            className="text-button" 
            onClick={toggleDarkMode}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>
        
        <AnimatePresence>
          {showReminders && (
            <motion.div 
              className="reminders-dropdown"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="reminder-header">Upcoming Dates</h3>
              {reminders.map(reminder => (
                <div key={reminder.id} className="reminder-item">
                  <div className="reminder-icon">
                    <FaBell />
                  </div>
                  <div className="reminder-details">
                    <div className="reminder-name">{reminder.name}</div>
                    <div className="reminder-event">{reminder.event}</div>
                    <div className="reminder-date">{reminder.date}</div>
                  </div>
                </div>
              ))}
              <button className="add-reminder-btn">
                Add Date Reminder
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showThemePicker && (
            <motion.div 
              className="theme-picker"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {THEMES.map(theme => (
                <div 
                  key={theme.id}
                  className={`theme-option ${currentTheme === theme.id ? 'active' : ''}`}
                  onClick={() => applyTheme(theme.id)}
                  style={{
                    background: `linear-gradient(145deg, ${theme.primaryColor}, ${theme.secondaryColor})`
                  }}
                >
                  <span className="theme-name">{theme.name}</span>
                  {currentTheme === theme.id && (
                    <div className="theme-active-indicator" />
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {showTooltip && (
        <div className="tooltip">
          <button className="tooltip-close" onClick={closeTooltip}>
            <FaTimes />
        </button>
          <h4><FaInfoCircle /> How to use WhatsApp Mini</h4>
          <p>This interface allows you to view multiple conversations at once:</p>
          <ul>
            <li>Click on a chat to open it</li>
            <li>Use the left arrow to open a chat on the left side</li>
            <li>Use the right arrow to open a chat on the right side</li>
            <li>Use the X button to close a chat</li>
            <li>A chat can only appear on one side at a time</li>
          </ul>
        </div>
      )}
      
      <div className={`app-inner ${selectedChats.right ? 'dual-panel' : ''}`}>
        <div className="left-panel">
          <ChatList 
            chats={chatList} 
            onChatSelect={handleChatSelect} 
            selectedChats={selectedChats}
          />
        </div>
        
        {!selectedChats.left && !selectedChats.right ? (
          <div className="main-chat-area">
            <div className="welcome-screen">
              <div className="welcome-icon">
                <FaMagic size={60} />
              </div>
              <h2>Welcome to GF Chat Manager</h2>
              <p>The perfect solution for managing multiple conversations discreetly</p>
              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-icon">👥</div>
                  <div className="feature-text">Chat with multiple girlfriends at once</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🎨</div>
                  <div className="feature-text">Customize themes for each conversation</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">💬</div>
                  <div className="feature-text">Keep track of important conversations</div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔍</div>
                  <div className="feature-text">Never mix up conversations again</div>
                </div>
              </div>
              <p className="start-prompt">Select a chat from the list to begin!</p>
            </div>
          </div>
        ) : (
          <>
            <div className="main-chat-area">
              {selectedChats.left && <ChatWindow chat={selectedChats.left} />}
            </div>
            
            {selectedChats.right && (
              <div className="right-panel">
                <ChatWindow chat={selectedChats.right} />
              </div>
            )}
          </>
        )}
      </div>
      
      <style jsx>{`
        /* Dark theme variables are directly in CSS now */
        .app-inner {
          display: flex;
          flex: 1;
          position: relative;
          overflow: hidden;
        }

        .chat-interface {
          display: flex;
          width: 100%;
          height: 100%;
        }

        .left-panel {
          width: 320px;
          min-width: 250px;
          border-right: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
        }

        .main-chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .right-panel {
          flex: 1;
          border-left: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
        }

        .dual-chat .main-chat-area {
          flex: 1;
        }

        .dual-chat .right-panel {
          flex: 1;
        }

        .welcome-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          width: 100%;
          background-color: var(--panel-bg);
          padding: 20px;
          text-align: center;
        }
        
        .tooltip {
          position: absolute;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          background-color: #1A1A1A;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          padding: 16px;
          max-width: 300px;
          z-index: 1000;
          font-size: 0.85rem;
          line-height: 1.5;
          color: #FFFFFF;
        }
        
        .tooltip h4 {
          margin-top: 0;
          margin-bottom: 8px;
          font-size: 1rem;
          color: #00BFA5;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .tooltip p {
          margin: 0 0 8px;
          color: #CCCCCC;
        }
        
        .tooltip ul {
          margin: 0;
          padding-left: 20px;
          color: #CCCCCC;
        }
        
        .tooltip li {
          margin-bottom: 4px;
        }
        
        .tooltip-close {
          position: absolute;
          top: 8px;
          right: 8px;
          background: none;
          border: none;
          cursor: pointer;
          color: #8E9396;
          padding: 4px;
          font-size: 1rem;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .tooltip-close:hover {
          color: #00BFA5;
        }
        
        .app-title svg {
          color: #00BFA5;
          font-size: 1.4rem;
        }
        
        .reminder-btn {
          position: relative;
        }
        
        .reminder-badge {
          position: absolute;
          top: 0;
          right: 0;
          background-color: #ff6b6b;
          color: white;
          font-size: 0.7rem;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .reminders-dropdown {
          position: absolute;
          top: 50px;
          right: 60px;
          background-color: #1A1A1A;
          border-radius: 8px;
          padding: 12px;
          width: 260px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.4);
          z-index: 100;
          border: 1px solid var(--border-color);
        }
        
        .reminder-header {
          font-size: 0.95rem;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-color);
          color: var(--primary-text);
        }
        
        .reminder-item {
          display: flex;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .reminder-icon {
          width: 32px;
          height: 32px;
          background-color: rgba(255, 107, 107, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 10px;
          color: #ff6b6b;
        }
        
        .reminder-details {
          flex: 1;
        }
        
        .reminder-name {
          font-weight: 500;
          font-size: 0.9rem;
          color: var(--primary-text);
        }
        
        .reminder-event {
          font-size: 0.8rem;
          color: var(--primary);
          margin: 2px 0;
        }
        
        .reminder-date {
          font-size: 0.75rem;
          color: var(--secondary-text);
        }
        
        .add-reminder-btn {
          width: 100%;
          background-color: var(--primary);
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px;
          margin-top: 10px;
          cursor: pointer;
          font-size: 0.85rem;
          transition: background-color 0.2s;
        }
        
        .add-reminder-btn:hover {
          background-color: var(--primary-light);
        }
        
        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--panel-bg);
          z-index: 9999;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
        }
        
        .mobile-message {
          text-align: center;
          background-color: var(--light-bg);
          padding: 30px;
          border-radius: 16px;
          max-width: 300px;
          border: 1px solid var(--border-color);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }
        
        .mobile-message h2 {
          color: var(--primary);
          margin-bottom: 16px;
        }
        
        .mobile-message p {
          color: var(--primary-text);
          margin-bottom: 8px;
        }
        
        .mobile-subtitle {
          color: var(--secondary-text);
          font-size: 14px;
          margin-bottom: 24px;
        }
        
        .coming-soon-badge {
          display: inline-block;
          background: var(--primary-gradient);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          animation: pulse 2s infinite;
        }
      `}</style>
    </div>
  );
}

export default App;
