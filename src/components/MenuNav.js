import { 
  Home, 
  User, 
  Settings, 
  Users, 
  BookOpen, 
  Calendar,
  FileText,
  BarChart3,
  Shield,
  HelpCircle,
  Mail,
  ChevronRight
} from "lucide-react";

// Animation variants for smooth transitions
export const dropdownVariants = {
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  open: {
    height: "auto",
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Chevron rotation variants
export const chevronVariants = {
  closed: {
    rotate: 0,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  open: {
    rotate: 90,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

// Menu item hover variants
export const menuItemVariants = {
  rest: {
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2,
      ease: "easeInOut"
    }
  }
};

// Main navigation items
export const mainNavigation = [
  { 
    name: "Dashboard", 
    href: "/dashboard", 
    icon: Home
  },
  { 
    name: "Data Kepegawaian", 
    href: "/profile", 
    icon: User
  },
];

// Dropdown navigation items
export const dropdownNavigation = [
  {
    name: "Persuratan",
    icon: BookOpen,
    children: [
      { name: "Surat Keputusan", href: "/persuratan/sk", icon: Mail },
      { name: "Surat Masuk", href: "/persuratan/incoming", icon: Mail },
      { name: "Surat Tugas", href: "/classes", icon: Calendar },
      { name: "Surat Rekomendasi", href: "/subjects", icon: FileText },
    ]
  },
  {
    name: "Human Capital",
    icon: BarChart3,
    children: [
      { name: "Student Reports", href: "/reports/students", icon: FileText },
      { name: "Academic Reports", href: "/reports/academic", icon: BarChart3 },
      { name: "Financial Reports", href: "/reports/financial", icon: BarChart3 },
    ]
  },
  {
    name: "Administration",
    icon: Shield,
    children: [
      { name: "User Management", href: "/administrasi/users", icon: Users },
      { name: "Role Management", href: "/admin/roles", icon: Shield },
      { name: "System Settings", href: "/admin/settings", icon: Settings },
    ]
  },
  {
    name: "Hubinkom",
    icon: HelpCircle,
    children: [
      { name: "Help Center", href: "/help", icon: HelpCircle },
      { name: "Documentation", href: "/docs", icon: FileText },
      { name: "Contact Support", href: "/support", icon: User },
    ]
  }
];

// Settings navigation (for user menu)
export const settingsNavigation = [
  { name: "Profile Settings", href: "/profile", icon: User },
  { name: "Account Settings", href: "/settings", icon: Settings },
  { name: "Preferences", href: "/preferences", icon: Settings },
];

// CSS classes for smooth transitions
export const transitionClasses = {
  // Dropdown container
  dropdownContainer: "overflow-hidden transition-all duration-300 ease-in-out",
  
  // Dropdown content
  dropdownContent: "transform transition-all duration-300 ease-in-out",
  
  // Chevron icon
  chevronIcon: "transition-transform duration-200 ease-in-out",
  
  // Menu items
  menuItem: "transition-all duration-200 ease-in-out transform",
  
  // Hover effects
  hoverScale: "hover:scale-105",
  hoverTranslate: "hover:-translate-y-0.5",
  
  // Active states
  activeSlide: "transition-all duration-200 ease-in-out",
  
  // Fade effects
  fadeIn: "animate-in fade-in duration-200",
  fadeOut: "animate-out fade-out duration-200",
  
  // Slide effects
  slideDown: "animate-in slide-in-from-top-2 duration-300",
  slideUp: "animate-out slide-out-to-top-2 duration-300",
  
  // Stagger animation for children
  staggerChild: "animate-in slide-in-from-left-2 duration-300",
  staggerDelay: (index) => `delay-[${index * 50}ms]`
};

// Animation keyframes (for custom CSS)
export const keyframes = `
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideUp {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-10px);
    }
  }
  
  @keyframes fadeInScale {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes chevronRotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(90deg);
    }
  }
`;

// Utility functions for animations
export const getStaggerDelay = (index) => `delay-[${index * 50}ms]`;
export const getSlideDirection = (isOpen) => isOpen ? 'slideDown' : 'slideUp';
export const getFadeClass = (isVisible) => isVisible ? 'fadeIn' : 'fadeOut';
