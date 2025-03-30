
import { useState, useEffect } from "react";
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
  Phone,
  MapPin,
  Pill,
  Activity,
  Upload,
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
import { useToast } from "@/hooks/use-toast";

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
      items.push({
        name: "Emergency Access",
        icon: <AlertTriangle size={20} />,
        link: "/emergency-access",
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

    if (user?.role === "patient") {
      items.push({
        name: "Emergency Contacts",
        icon: <Phone size={20} />,
        link: "/emergency-contacts",
        roles: ["patient"],
      });
      items.push({
        name: "Health Risk Analysis",
        icon: <Activity size={20} />,
        link: "/health-risk",
        roles: ["patient"],
      });
    }

    // Add hospital locator for both patients and hospitals
    items.push({
      name: "Hospital Locator",
      icon: <MapPin size={20} />,
      link: "/hospital-locator",
      roles: ["patient", "hospital", "doctor"],
    });

    // Add document management for all roles
    items.push({
      name: "Documents",
      icon: <Upload size={20} />,
      link: "/documents",
      roles: ["patient", "doctor", "hospital"],
    });

    // Add emergency medication finder for all roles
    items.push({
      name: "Medication Finder",
      icon: <Pill size={20} />,
      link: "/medication-finder",
      roles: ["patient", "doctor", "hospital"],
    });

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
    <aside
      className={`${
        collapsed && !isMobile ? "w-20" : "w-64"
      } bg-sidebar h-full transition-all duration-300 flex flex-col fixed`}
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
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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

      <nav className="mt-8 flex-1 overflow-y-auto">
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

      <div className="p-4 border-t border-sidebar-border mt-auto">
        {(!collapsed || isMobile) && (
          <div className="text-xs text-sidebar-foreground/70">
            MediFlow 360 v1.1.0
          </div>
        )}
      </div>
    </aside>
  );
};

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Update sidebar collapsed state when screen size changes
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(true);
    }
  }, [isMobile]);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      navigate("/login");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {!sidebarCollapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-20" 
          onClick={() => setSidebarCollapsed(true)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        ${sidebarCollapsed && isMobile ? "hidden" : "block"}
        z-30
      `}>
        <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      </div>
      
      {/* Main content */}
      <div className={`flex-1 flex flex-col ${
        sidebarCollapsed && !isMobile ? "ml-20" : "ml-0 md:ml-64"
      } transition-all duration-300`}>
        {/* Header */}
        <header className="h-16 bg-white border-b border-border shadow-sm flex items-center justify-between px-4 sticky top-0 z-10">
          <div className="flex items-center">
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarCollapsed(false)}
                className="mr-2"
                aria-label="Open sidebar"
              >
                <Menu size={20} />
              </Button>
            )}
            <h1 className="text-xl font-bold text-medical-800 hidden sm:block">
              {user?.role === "patient" 
                ? "Patient Dashboard" 
                : user?.role === "doctor"
                ? "Doctor Dashboard"
                : "Hospital Dashboard"}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" className="rounded-full relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                3
              </span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={user?.profilePicture} alt={user?.name} />
                    <AvatarFallback className="bg-medical-200 text-medical-700">
                      {user?.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                        : "U"}
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
                  disabled={isLoading}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{isLoading ? "Logging out..." : "Log out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content area */}
        <div className="flex-1 p-6 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
