"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Menu,
  X,
  User,
  LogOut,
  Bell,
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import {
  mainNavigation,
  dropdownNavigation,
  settingsNavigation,
  transitionClasses,
  getStaggerDelay
} from "@/components/MenuNav";

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});

  const { user, logout, canAccess } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Filter dropdown navigation berdasarkan role user
  const filteredDropdownNavigation = useMemo(() => {
    if (!user) return [];

    return dropdownNavigation.filter(section => {
      if (!section.roles || section.roles.length === 0) return true;
      return canAccess(section.roles);
    });
  }, [user, canAccess]);

  // ✅ Filter main navigation berdasarkan role user
  const filteredMainNavigation = useMemo(() => {
    if (!user) return mainNavigation;

    return mainNavigation.filter(item => {
      if (!item.roles || item.roles.length === 0) return true;
      return canAccess(item.roles);
    });
  }, [user, canAccess]);

  const handleLogout = async () => {
    await logout();
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  const isActiveLink = (href) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const hasActiveChild = (children) => {
    return children.some(child => isActiveLink(child.href));
  };

  const shouldOpenDropdown = (sectionName, children) => {
    return openDropdowns[sectionName] || hasActiveChild(children);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-90 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white dark:bg-slate-800 shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-red-700 to-red-600">
          {!sidebarCollapsed && <h1 className="text-xl font-bold text-white">SISTELK12</h1>}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block text-white hover:text-gray-200 p-1 rounded"
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <nav className="mt-6 px-3 pb-20 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
          <div className="space-y-1">
            {/* ✅ Main Navigation - FILTERED */}
            {filteredMainNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveLink(item.href);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg ${transitionClasses.menuItem} ${sidebarCollapsed ? 'justify-center' : ''
                    } ${isActive
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-r-2 border-red-600 dark:border-red-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300'
                    }`}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <Icon className={`h-5 w-5 ${transitionClasses.menuItem} ${sidebarCollapsed ? '' : 'mr-3'
                    } ${isActive
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400'
                    }`} />
                  {!sidebarCollapsed && item.name}
                </a>
              );
            })}

            {/* ✅ Dropdown Navigation - FILTERED */}
            {filteredDropdownNavigation.map((section) => {
              const Icon = section.icon;
              const isOpen = shouldOpenDropdown(section.name, section.children);
              const hasActive = hasActiveChild(section.children);

              return (
                <div key={section.name} className="space-y-1">
                  <button
                    onClick={() => toggleDropdown(section.name)}
                    className={`group w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 text-sm font-medium rounded-lg ${transitionClasses.menuItem} ${hasActive
                      ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300'
                      }`}
                    title={sidebarCollapsed ? section.name : ''}
                  >
                    <div className="flex items-center">
                      <Icon className={`${sidebarCollapsed ? '' : 'mr-3'} h-5 w-5 ${transitionClasses.menuItem} ${hasActive
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400'
                        }`} />
                      {!sidebarCollapsed && section.name}
                    </div>
                    {!sidebarCollapsed && (
                      <ChevronRight className={`h-4 w-4 text-gray-400 dark:text-gray-500 ${transitionClasses.chevronIcon} ${isOpen ? 'rotate-90' : ''
                        }`} />
                    )}
                  </button>

                  {!sidebarCollapsed && (
                    <div className={`${transitionClasses.dropdownContainer} ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}>
                      <div className={`ml-6 space-y-1 ${transitionClasses.dropdownContent} ${isOpen ? 'translate-y-0' : '-translate-y-2'
                        }`}>
                        {section.children.map((child, index) => {
                          const ChildIcon = child.icon;
                          const isChildActive = isActiveLink(child.href);
                          return (
                            <a
                              key={child.name}
                              href={child.href}
                              className={`group flex items-center px-3 py-2 text-sm rounded-lg ${transitionClasses.menuItem} ${transitionClasses.staggerChild} ${getStaggerDelay(index)} ${isChildActive
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-r-2 border-red-600 dark:border-red-500'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300'
                                }`}
                              style={{
                                animationDelay: isOpen ? `${index * 50}ms` : '0ms'
                              }}
                            >
                              <ChildIcon className={`mr-3 h-4 w-4 ${transitionClasses.menuItem} ${isChildActive
                                ? 'text-red-600 dark:text-red-400'
                                : 'text-gray-400 dark:text-gray-500 group-hover:text-red-500 dark:group-hover:text-red-400'
                                }`} />
                              {child.name}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>

        {/* User info at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
        }`}>
        {/* Header */}
        <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left side */}
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <div className="hidden md:block ml-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      className="block w-64 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-400 rounded-lg text-sm bg-white dark:bg-white text-gray-900 dark:text-gray-900 placeholder-gray-500 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <div className="h-8 w-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <span className="hidden md:block text-gray-700 dark:text-gray-300 font-medium">
                      {user?.username || 'User'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  </button>

                  {/* Dropdown menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700">
                      <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {user?.username || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email || 'user@example.com'}
                        </p>
                        {/* ✅ Tampilkan role user */}
                        <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
                          Role: {user?.role || 'user'}
                        </p>
                      </div>

                      {/* Settings Navigation */}
                      {settingsNavigation.map((item) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Icon className="h-4 w-4 mr-3 text-gray-400 dark:text-gray-500" />
                            {item.name}
                          </a>
                        );
                      })}

                      <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>

                      {/* Logout button */}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-slate-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="h-8 w-8 bg-gradient-to-r from-red-700 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">SISTELK12</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sistem Informasi Sekolah</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <a href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-xs text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  Contact
                </a>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                © 2024 SISTELK12. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}