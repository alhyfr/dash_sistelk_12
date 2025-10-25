"use client";
import { useState } from "react";
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
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await logout();
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [dropdownName]: !prev[dropdownName]
    }));
  };

  // Function to check if a link is active
  const isActiveLink = (href) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Function to check if a dropdown section has active children
  const hasActiveChild = (children) => {
    return children.some(child => isActiveLink(child.href));
  };

  // Auto-open dropdown if it has active children
  const shouldOpenDropdown = (sectionName, children) => {
    return openDropdowns[sectionName] || hasActiveChild(children);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-red-700 to-red-600">
          {!sidebarCollapsed && <h1 className="text-xl font-bold text-white">SISTELK12</h1>}
          <div className="flex items-center space-x-2">
            {/* Desktop collapse button */}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:block text-white hover:text-gray-200 p-1 rounded"
            >
              {sidebarCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {/* Main Navigation */}
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveLink(item.href);
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-lg ${transitionClasses.menuItem} ${
                    sidebarCollapsed ? 'justify-center' : ''
                  } ${
                    isActive
                      ? 'bg-red-100 text-red-700 border-r-2 border-red-600'
                      : 'text-gray-700 hover:bg-red-50 hover:text-red-700'
                  }`}
                  title={sidebarCollapsed ? item.name : ''}
                >
                  <Icon className={`h-5 w-5 ${transitionClasses.menuItem} ${
                    sidebarCollapsed ? '' : 'mr-3'
                  } ${
                    isActive
                      ? 'text-red-600'
                      : 'text-gray-400 group-hover:text-red-500'
                  }`} />
                  {!sidebarCollapsed && item.name}
                </a>
              );
            })}

            {/* Dropdown Navigation */}
            {dropdownNavigation.map((section) => {
              const Icon = section.icon;
              const isOpen = shouldOpenDropdown(section.name, section.children);
              const hasActive = hasActiveChild(section.children);
              
              return (
                <div key={section.name} className="space-y-1">
                  <button
                    onClick={() => toggleDropdown(section.name)}
                    className={`group w-full flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2 text-sm font-medium rounded-lg ${transitionClasses.menuItem} ${
                      hasActive
                        ? 'bg-red-50 text-red-700'
                        : 'text-gray-700 hover:bg-red-50 hover:text-red-700'
                    }`}
                    title={sidebarCollapsed ? section.name : ''}
                  >
                    <div className="flex items-center">
                      <Icon className={`${sidebarCollapsed ? '' : 'mr-3'} h-5 w-5 ${transitionClasses.menuItem} ${
                        hasActive
                          ? 'text-red-600'
                          : 'text-gray-400 group-hover:text-red-500'
                      }`} />
                      {!sidebarCollapsed && section.name}
                    </div>
                    {!sidebarCollapsed && (
                      <ChevronRight className={`h-4 w-4 text-gray-400 ${transitionClasses.chevronIcon} ${
                        isOpen ? 'rotate-90' : ''
                      }`} />
                    )}
                  </button>
                  
                  {/* Dropdown Content - Only show when not collapsed */}
                  {!sidebarCollapsed && (
                    <div className={`${transitionClasses.dropdownContainer} ${
                      isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}>
                      <div className={`ml-6 space-y-1 ${transitionClasses.dropdownContent} ${
                        isOpen ? 'translate-y-0' : '-translate-y-2'
                      }`}>
                        {section.children.map((child, index) => {
                          const ChildIcon = child.icon;
                          const isChildActive = isActiveLink(child.href);
                          return (
                            <a
                              key={child.name}
                              href={child.href}
                              className={`group flex items-center px-3 py-2 text-sm rounded-lg ${transitionClasses.menuItem} ${transitionClasses.staggerChild} ${getStaggerDelay(index)} ${
                                isChildActive
                                  ? 'bg-red-100 text-red-700 border-r-2 border-red-600'
                                  : 'text-gray-600 hover:bg-red-50 hover:text-red-700'
                              }`}
                              style={{
                                animationDelay: isOpen ? `${index * 50}ms` : '0ms'
                              }}
                            >
                              <ChildIcon className={`mr-3 h-4 w-4 ${transitionClasses.menuItem} ${
                                isChildActive
                                  ? 'text-red-600'
                                  : 'text-gray-400 group-hover:text-red-500'
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
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-red-600" />
              </div>
            </div>
            {!sidebarCollapsed && (
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.username || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'user@example.com'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
      }`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left side */}
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                >
                  <Menu className="h-6 w-6" />
                </button>
                
                {/* Search bar */}
                <div className="hidden md:block ml-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search..."
                      className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center space-x-3 p-2 text-sm rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-red-600" />
                    </div>
                    <span className="hidden md:block text-gray-700 font-medium">
                      {user?.username || 'User'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>

                  {/* Dropdown menu */}
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.username || 'User'}</p>
                        <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                      </div>
                      
                      {/* Settings Navigation */}
                      {settingsNavigation.map((item) => {
                        const Icon = item.icon;
                        return (
                          <a
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Icon className="h-4 w-4 mr-3 text-gray-400" />
                            {item.name}
                          </a>
                        );
                      })}
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
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
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <div className="h-8 w-8 bg-gradient-to-r from-red-700 to-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">S</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">SISTELK12</p>
                  <p className="text-xs text-gray-500">Sistem Informasi Sekolah</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <a href="#" className="text-xs text-gray-500 hover:text-red-600 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-xs text-gray-500 hover:text-red-600 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-xs text-gray-500 hover:text-red-600 transition-colors">
                  Contact
                </a>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 text-center">
                © 2024 SISTELK12. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
