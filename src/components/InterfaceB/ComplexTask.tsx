import React, { useState, useEffect, useRef } from 'react';
import { Timer } from '../shared/Timer';

interface Props {
  task: {
    id: string;
    description: string;
    target: string;
  };
  onComplete: (result: any) => void;
  interfaceType: 'A' | 'B';
}

interface MenuItemContent {
  label: string;
  type: 'menu';
  children: Record<string, MenuItem>;
}

interface MenuItemAction {
  label: string;
  type: 'item';
  content?: string;
}

type MenuItem = MenuItemContent | MenuItemAction;

function isMenuItemContent(item: MenuItem): item is MenuItemContent {
  return item.type === 'menu' && 'children' in item;
}

const ComplexTask: React.FC<Props> = ({ task, onComplete, interfaceType }) => {
  const [currentMenuKey, setCurrentMenuKey] = useState<string>('main');
  const [path, setPath] = useState<string[]>(['Main']);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [taskComplete, setTaskComplete] = useState(false);
  const [startTime] = useState(Date.now());
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [showContent, setShowContent] = useState<{ [key: string]: boolean }>({});
  const startReactionRef = useRef<number>(Date.now());
  const taskCompletedRef = useRef(false);

  // Complete menu structure with content
  const menuStructure: Record<string, MenuItem> = {
    'main': {
      label: 'Main',
      type: 'menu',
      children: {
        'dashboard': { label: 'Dashboard', type: 'item', content: '📊 Dashboard\nToday\'s Summary\n- 5 new notifications\n- 3 pending tasks\n- System status: Online' },
        'administration': { 
          label: 'Administration', 
          type: 'menu',
          children: {
            'user-management': { label: 'User Management', type: 'item', content: '👥 User Management\nActive Users: 25\nPending Requests: 3\nRoles: Admin, Editor, Viewer' },
            'role-management': { label: 'Role Management', type: 'item', content: '🔑 Role Management\nRoles:\n- Administrator\n- Manager\n- Editor\n- Viewer' },
            'audit-logs': { label: 'Audit Logs', type: 'item', content: '📜 Audit Logs\nRecent Activity:\n- User login: 2 min ago\n- Settings change: 1 hour ago\n- System update: yesterday' },
            'system-settings': { label: 'System Settings', type: 'item', content: '⚙️ System Settings\nGeneral Settings:\n- System Name: Study Platform\n- Version: 2.0.1\n- Maintenance Mode: Off\n\nAdvanced Settings:\n- Cache: Enabled\n- Logging: Verbose\n- Backup: Daily' }
          }
        },
        'user-tools': {
          label: 'User Tools',
          type: 'menu',
          children: {
            'profile': { label: 'Profile', type: 'item', content: '👤 User Profile\nName: John Doe\nEmail: john.doe@example.com\nDepartment: Research\nJoined: Jan 2024' },
            'preferences': { label: 'Preferences', type: 'item', content: '⚙️ Preferences\nTheme: Dark\nLanguage: English\nNotifications: On\nAuto-save: Enabled' },
            'notifications': { label: 'Notifications', type: 'item', content: '🔔 Notifications\nUnread: 3\n- System update available\n- New task assigned\n- Meeting reminder' },
            'account-settings': { label: 'Account Settings', type: 'item', content: '🔐 Account Settings\nSecurity:\n- 2FA: Enabled\n- Last password change: 30 days ago\n- Active sessions: 2' }
          }
        },
        'system': {
          label: 'System',
          type: 'menu',
          children: {
            'hardware': { label: 'Hardware', type: 'item', content: '💻 Hardware\nCPU: Intel i7-11700K\nRAM: 32GB DDR4\nStorage: 1TB NVMe SSD\nGPU: RTX 3080' },
            'software': { label: 'Software', type: 'item', content: '🖥️ Software\nOS: Windows 11 Pro\nBrowser: Chrome 122.0\nNode.js: v18.16.0\nDocker: 24.0.7' },
            'networks': { label: 'Networks', type: 'item', content: '🌐 Networks\nLAN: 192.168.1.0/24\nVPN: Connected\nFirewall: Active\nDNS: 8.8.8.8' },
            'security': { label: 'Security', type: 'item', content: '🔒 Security\nFirewall Status: Active\nAntivirus: Updated\nSSL Certificate: Valid\nRecent Security Events: None' },
            'system-settings': { label: 'System Settings', type: 'item', content: '⚙️ System Settings\nSystem Configuration:\n- Hostname: study-server\n- Domain: study.local\n- Time Zone: EST\n- NTP: synced\n\nPerformance:\n- CPU Usage: 45%\n- Memory Usage: 67%\n- Disk Usage: 82%' }
          }
        },
        'help-center': {
          label: 'Help Center',
          type: 'menu',
          children: {
            'documentation': { label: 'Documentation', type: 'item', content: '📚 Documentation\nGetting Started Guide\nAPI Reference\nUser Manual\nTroubleshooting Guide' },
            'faqs': { label: 'FAQs', type: 'item', content: '❓ Frequently Asked Questions\nQ: How to reset password?\nA: Use "Forgot Password" option\n\nQ: System requirements?\nA: See documentation\n\nQ: Support hours?\nA: 24/7' },
            'technical-support': { label: 'Technical Support', type: 'item', content: '🛠️ Technical Support\nLive Chat: Available\nEmail: support@example.com\nPhone: +1 (555) 123-4567\nResponse Time: < 2 hours' },
            'community-forums': { label: 'Community Forums', type: 'item', content: '💬 Community Forums\nActive Topics:\n- General Discussion: 45 posts\n- Feature Requests: 12 posts\n- Bug Reports: 8 posts\n- Announcements: 3 posts' }
          }
        },
        'reports': { label: 'Reports', type: 'item', content: '📊 Reports\nAvailable Reports:\n- Usage Analytics\n- Performance Metrics\n- User Activity\n- System Health\n\nLast Generated: Yesterday' },
        'analytics': { label: 'Analytics', type: 'item', content: '📈 Analytics\nUser Stats:\n- Total Users: 1,247\n- Active Today: 89\n- New This Week: 34\n\nSystem Stats:\n- Avg Response: 120ms\n- Uptime: 99.97%\n- Errors: 0.1%' },
        'configuration': {
          label: 'Configuration',
          type: 'menu',
          children: {
            'system-settings': { label: 'System Settings', type: 'item', content: '⚙️ System Settings\nConfiguration Management:\n- Version: 2.0.1\n- Environment: Production\n- Debug Mode: Off\n\nService Settings:\n- API Endpoint: /api/v2\n- WebSocket: Enabled\n- Rate Limit: 1000/min' },
            'advanced-settings': { label: 'Advanced Settings', type: 'item', content: '🔧 Advanced Settings\nPerformance Tuning:\n- Cache Size: 512MB\n- Thread Pool: 8\n- Connection Pool: 20\n\nSecurity:\n- CORS: Restricted\n- Rate Limiting: Enabled\n- Log Level: INFO' },
            'backup': { label: 'Backup', type: 'item', content: '💾 Backup Settings\nScheduled Backups:\n- Frequency: Daily at 2 AM\n- Retention: 30 days\n- Location: S3 Bucket\n\nLast Backup: Today 2:00 AM\nSize: 2.4GB\nStatus: Successful' },
            'maintenance': { label: 'Maintenance', type: 'item', content: '🔨 Maintenance\nScheduled Maintenance:\n- OS Updates: Monthly\n- Security Patches: Weekly\n- Database Maintenance: Daily\n\nNext Maintenance: April 1, 2026\nDuration: 2 hours' }
          }
        }
      }
    }
  };

  // Get children for a specific menu key
  const getMenuChildren = (menuKey: string): Record<string, MenuItem> | null => {
    // Direct lookup for known menus
    if (menuKey === 'main') {
      const mainItem = menuStructure['main'];
      if (isMenuItemContent(mainItem)) {
        return mainItem.children;
      }
      return null;
    }

    // Search through the structure
    const searchMenus = (obj: Record<string, MenuItem>): Record<string, MenuItem> | null => {
      for (const key in obj) {
        const item = obj[key];
        if (isMenuItemContent(item)) {
          if (key === menuKey) {
            return item.children;
          }
          const found = searchMenus(item.children);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    return searchMenus(menuStructure);
  };

  const getCurrentOptions = (): { label: string; type: 'menu' | 'item'; content?: string; isBack?: boolean }[] => {
    const children = getMenuChildren(currentMenuKey);
    
    if (!children) {
      return [{ label: '← Back', type: 'item', isBack: true }];
    }

    const options = Object.values(children).map(item => ({
      label: item.label,
      type: item.type,
      content: 'content' in item ? item.content : undefined
    }));

    // Add Back button if not at main menu
    if (currentMenuKey !== 'main') {
      return [{ label: '← Back', type: 'item', isBack: true }, ...options];
    }

    return options;
  };

  const isTarget = (label: string): boolean => {
    return label === task.target;
  };

  const handleOptionClick = (label: string, type: 'menu' | 'item', isBack: boolean = false) => {
    if (taskCompletedRef.current) return;

    const reactionTime = Date.now() - startReactionRef.current;
    setReactionTimes([...reactionTimes, reactionTime]);
    startReactionRef.current = Date.now();

    // Handle back navigation
    if (isBack || label === '← Back') {
      if (path.length > 1) {
        const newPath = path.slice(0, -1);
        setPath(newPath);
        // Find the parent menu key
        const parentKey = newPath[newPath.length - 1] === 'Main' ? 'main' : 
          Object.keys(menuStructure).find(key => 
            menuStructure[key].label === newPath[newPath.length - 1]
          ) || 'main';
        setCurrentMenuKey(parentKey);
        startReactionRef.current = Date.now();
      }
      return;
    }

    // Check if this is the target
    if (isTarget(label) && type === 'item') {
      setSelectedOption(label);
      setTaskComplete(true);
      taskCompletedRef.current = true;
      
      const options = getCurrentOptions();
      const content = options.find(item => item.label === label)?.content;
      if (content) {
        setShowContent(prev => ({ ...prev, [label]: true }));
      }

      const completionTime = (Date.now() - startTime) / 1000;
      
      setTimeout(() => {
        onComplete({
          completionTime,
          errors: errorCount,
          reactionTimes,
          success: true,
          selectedOption: label,
          path: path,
        });
      }, 1500);
      return;
    }

    // Handle menu navigation
    if (type === 'menu') {
      // Find the key for this menu
      const menuKey = Object.keys(menuStructure).find(key => 
        menuStructure[key].label === label
      ) || label.toLowerCase().replace(/\s/g, '-');
      
      const newPath = [...path, label];
      setPath(newPath);
      setCurrentMenuKey(menuKey);
      setShowContent(prev => ({ ...prev, [label]: true }));
      startReactionRef.current = Date.now();
      return;
    }

    // If we're in a submenu and clicked an item that's not the target, count as error
    if (path.length > 1 && type === 'item' && !isBack) {
      setErrorCount(errorCount + 1);
      const element = document.getElementById(`nav-${label}`);
      if (element) {
        element.style.backgroundColor = '#fee2e2';
        element.style.borderColor = '#ef4444';
        setTimeout(() => {
          element.style.backgroundColor = '';
          element.style.borderColor = '';
        }, 500);
      }
    }
  };

  useEffect(() => {
    setCurrentMenuKey('main');
    setPath(['Main']);
    setSelectedOption(null);
    setErrorCount(0);
    setTaskComplete(false);
    taskCompletedRef.current = false;
    setShowContent({});
    startReactionRef.current = Date.now();
  }, [task]);

  const options = getCurrentOptions();

  return (
    <div className="space-y-4">
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Task:</h3>
        <p className="text-gray-700">{task.description}</p>
        {task.target && (
          <div className="mt-2 text-sm text-gray-500">
            🎯 Find: <span className="font-mono bg-gray-200 px-2 py-1 rounded">{task.target}</span>
          </div>
        )}
      </div>

      {/* Breadcrumb Path */}
      <div className="flex flex-wrap items-center gap-1 text-sm bg-gray-50 p-2 rounded-lg">
        <span className="text-gray-500">📍 Location:</span>
        {path.map((item, index) => (
          <React.Fragment key={index}>
            <span className={`font-medium ${index === path.length - 1 ? 'text-blue-600' : 'text-gray-600'}`}>
              {item}
            </span>
            {index < path.length - 1 && <span className="text-gray-400">›</span>}
          </React.Fragment>
        ))}
      </div>

      {/* Timer */}
      <Timer startTime={startTime} isPaused={taskComplete} />

      {/* Navigation Grid */}
      <div className="grid grid-cols-2 gap-2">
        {options.map((item) => (
          <button
            key={item.label}
            id={`nav-${item.label}`}
            onClick={() => handleOptionClick(item.label, item.type, item.isBack || false)}
            className={`p-3 border-2 rounded-lg transition-all text-left text-sm ${
              selectedOption === item.label 
                ? 'bg-green-100 border-green-500' 
                : taskComplete 
                  ? 'opacity-50 cursor-not-allowed bg-gray-100'
                  : item.isBack
                    ? 'bg-gray-100 border-gray-300 hover:bg-gray-200 text-gray-700'
                    : item.type === 'menu'
                      ? 'bg-blue-50 border-blue-200 hover:bg-blue-100'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
            }`}
            disabled={taskComplete}
          >
            <div className="flex items-center justify-between">
              <span className={`font-medium ${item.isBack ? 'text-gray-600' : ''}`}>
                {item.label}
              </span>
              {item.type === 'menu' && !item.isBack && (
                <span className="text-xs text-blue-600">📁</span>
              )}
              {item.type === 'item' && !item.isBack && (
                <span className="text-xs text-gray-400">📄</span>
              )}
            </div>
            {showContent[item.label] && item.content && (
              <div className="mt-2 text-xs text-gray-600 whitespace-pre-line border-t border-gray-200 pt-2">
                {item.content}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Feedback Messages */}
      {selectedOption && (
        <div className="p-3 bg-green-100 text-green-700 rounded-lg border border-green-300">
          <div className="font-semibold">✅ Task completed successfully!</div>
          <div className="text-sm mt-1">
            Found "{selectedOption}" through path: {path.join(' → ')}
            <br />
            Completion time: {((Date.now() - startTime) / 1000).toFixed(1)}s
          </div>
        </div>
      )}

      {errorCount > 0 && !taskComplete && (
        <div className="p-2 text-sm text-orange-600 bg-orange-50 rounded-lg border border-orange-200">
          ⚠️ Incorrect selections: {errorCount}
          <div className="text-xs text-orange-500 mt-1">
            Tip: Look for "{task.target}" in the submenus
          </div>
        </div>
      )}

      {/* Navigation Help */}
      {!taskComplete && path.length > 1 && (
        <div className="text-xs text-gray-400 text-center p-2 bg-gray-50 rounded-lg">
          💡 You're in <strong>{path.join(' → ')}</strong>. Look for "{task.target}" here or use ← Back
        </div>
      )}

      {!taskComplete && path.length === 1 && (
        <div className="text-xs text-gray-400 text-center p-2 bg-gray-50 rounded-lg">
          💡 Click on a folder (📁) to navigate deeper. Look for "{task.target}"
        </div>
      )}

      {taskComplete && (
        <div className="text-xs text-green-600 text-center font-medium">
          ✓ Task completed! Moving to next task...
        </div>
      )}
    </div>
  );
};

export default ComplexTask;