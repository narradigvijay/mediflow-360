
import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  FileText,
  CalendarClock,
  Users,
  Bell,
  AlertTriangle,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

const Sidebar = ({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (val: boolean) => void }) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const getNavItems = () => {
    const items = [
      {
        name: "Dashboard",
        icon: <LayoutDashboard size={20} />,
        link: "/dashboard",
        roles: ["patient", "doctor", "hospital"],
      },
      {
        name: "Health Records",
        icon: <FileText size={20} />,
        link: "/health-records",
        roles: ["patient", "doctor", "hospital"],
      },
      {
        name: "Appointments",
        icon: <CalendarClock size={20} />,
        link: "/appointments",
        roles: ["patient", "doctor"],
      },
    ];

    // Add role-specific items
    if (user?.role === "doctor") {
      items.push({
        name: "My Patients",
        icon: <Users size={20} />,
        link: "/my-patients",
        roles: ["doctor"],
      });
    }

    if (user?.role === "hospital") {
      items.push({
        name: "Emergency Access",
        icon: <AlertTriangle size={20} />,
        link: "/emergency-access",
        roles: ["hospital"],
      });
    }

    // Add common items at the end
    items.push(
      {
        name: "Notifications",
        icon: <Bell size={20} />,
        link: "/notifications",
        roles: ["patient", "doctor", "hospital"],
      },
      {
        name: "Settings",
        icon: <Settings size={20} />,
        link: "/settings",
        roles: ["patient", "doctor", "hospital"],
      }
    );

    return items.filter((item) => item.roles.includes(user?.role || ""));
  };

  const navItems = getNavItems();

  return (
    <div
      className={`${
        collapsed && !isMobile ? "w-20" : "w-64"
      } bg-sidebar fixed h-full transition-all duration-300 z-10`}
    >
      {isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-4 right-4 p-2 rounded-full bg-sidebar-accent hover:bg-sidebar-accent-foreground/10"
        >
          <X size={20} />
        </button>
      )}
      
      <div className="p-4">
        <div className={`flex ${collapsed && !isMobile ? "justify-center" : "justify-between"} items-center`}>
          {(!collapsed || isMobile) && (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-medical-500 flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="white" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="w-4 h-4"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <span className="text-sidebar-foreground font-bold ml-2">MediFlow 360</span>
            </div>
          )}
          {collapsed && !isMobile && (
            <div className="h-8 w-8 rounded-full bg-medical-500 flex items-center justify-center">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-4 h-4"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
          )}
          {!isMobile && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-full hover:bg-sidebar-accent"
            >
              <ChevronDown
                size={18}
                className={`transform transition-transform ${
                  collapsed ? "-rotate-90" : "rotate-0"
                }`}
              />
            </button>
          )}
        </div>
      </div>

      <nav className="mt-8">
        <ul className="space-y-2 px-3">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.link}
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-md transition-colors ${
                    isActive
                      ? "bg-sidebar-primary text-white"
                      : "text-sidebar-foreground hover:bg-sidebar-accent"
                  } ${collapsed && !isMobile ? "justify-center" : ""}`
                }
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {(!collapsed || isMobile) && (
                  <span className="ml-3">{item.name}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-16 fixed top-0 left-0 right-0 bg-white border-b border-border shadow-sm z-10 flex items-center justify-between px-4">
        <div className="flex items-center">
          {isMobile && (
            <button
              onClick={() => setSidebarCollapsed(false)}
              className="p-2 mr-2 rounded-full hover:bg-gray-100"
            >
              <Menu size={20} />
            </button>
          )}
          <div className={`${!isMobile && "ml-16"} ${sidebarCollapsed && !isMobile ? "ml-20" : "ml-64"} transition-all duration-300`}>
            <h1 className="text-xl font-bold text-medical-800">MediFlow 360</h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" className="rounded-full">
            <Bell size={20} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src={user?.profilePicture} alt={user?.name} />
                  <AvatarFallback className="bg-medical-200 text-medical-700">
                    {user?.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  <span className="inline-flex items-center rounded-full bg-medical-100 px-2 py-1 text-xs font-medium text-medical-800 mt-1">
                    {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => navigate("/settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-500 focus:text-red-500"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className={`
        ${sidebarCollapsed && !isMobile ? "ml-20" : "ml-0 md:ml-64"}
        pt-16 min-h-screen transition-all duration-300
      `}>
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
