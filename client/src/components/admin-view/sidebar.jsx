import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Plus,
  BookOpen,
  UserCheck,
  BarChart3,
  Users,
  GraduationCap,
  Menu,
  X,
  Settings,
  Bell,
  UserRoundPlus
} from 'lucide-react';
const AdminHeader = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
      description: 'Overview and analytics'
    },
    {
      name: 'Add Course',
      href: '/admin/add-course',
      icon: Plus,
      description: 'Create new courses'
    },
    {
      name: 'All Courses',
      href: '/admin/courses',
      icon: BookOpen,
      description: 'Manage all courses'
    },
    {
      name: 'Enroll Students',
      href: '/admin/enrollcourse',
      icon: UserCheck,
      description: 'Course enrollment'
    },
    {
      name: 'Weekly Stats',
      href: '/admin/weekly-stats',
      icon: BarChart3,
      description: 'Performance metrics'
    },
    {
      name: 'Students',
      href: '/admin/students',
      icon: Users,
      description: 'Student management'
    },
    {
      name: 'Course Analytics',
      href: '/admin/coursewisestudent',
      icon: GraduationCap,
      description: 'Course-wise analytics'
    },
    {
      name: 'Add Student',
      href: '/admin/add-student',
      icon: UserRoundPlus,
      description: 'register new student'
    }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-lg border border-gray-200 transition-all duration-200"
        >
          {sidebarOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-gray-900 bg-opacity-50 z-40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                <p className="text-blue-100 text-xs">Course Management</p>
              </div>
            </div>
           
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">
                Main Navigation
              </p>
              {navigationItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-in-out relative overflow-hidden ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 shadow-sm border border-blue-100'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-r-full"></div>
                        )}
                        <IconComponent
                          className={`mr-3 h-5 w-5 transition-colors duration-200 flex-shrink-0 ${
                            isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className={`text-xs truncate mt-0.5 ${
                            isActive ? 'text-blue-600' : 'text-gray-500'
                          }`}>
                            {item.description}
                          </p>
                        </div>
                        {isActive && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full ml-2 animate-pulse"></div>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-white shadow-sm border border-gray-200">
              <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">System Online</p>
                <p className="text-xs text-gray-500">All services operational</p>
              </div>
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminHeader;