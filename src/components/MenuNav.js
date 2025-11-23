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
  Briefcase,
  User2,
  ChevronRight
} from "lucide-react";

// ❌ HAPUS - useAuth tidak bisa dipanggil di sini
// const { user } = useAuth();

// Animation variants
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
    icon: Home,
    roles: [] // Empty = semua user bisa akses
  },
  { 
    name: "Data Kepegawaian", 
    href: "/profile", 
    icon: User,
    roles: [] // Empty = semua user bisa akses
  },
];

// Dropdown navigation items
export const dropdownNavigation = [
  {
    name: "Persuratan",
    icon: BookOpen,// ✅ Roles yang bisa akses
    children: [
      { name: "Surat Keputusan", href: "/persuratan/sk", icon: Mail },
      { name: "Surat Masuk", href: "/persuratan/incoming", icon: Mail },
      { name: "Surat Tugas", href: "/persuratan/tugas", icon: Calendar },
      { name: "Surat Rekomendasi", href: "/persuratan/rekomendasi", icon: FileText },
      { name: "Keterangan", href: "/persuratan/keterangan", icon: FileText },
    ]
  },
  {
    name: "Human Capital",
    icon: Briefcase,
    roles: ["admin", "superadmin", "hc","HC"], // ✅ Roles yang bisa akses
    children: [
      { name: "SOTK", href: "/hc/sotk", icon: Users },
      { name: "Kepegawaian", href: "/hc/gupeg", icon: Briefcase },
      { name: "Financial Reports", href: "/reports/financial", icon: BarChart3 },
    ]
  },
  {
    name: "Administration",
    icon: Shield,
    roles: ["admin", "superadmin"], // ✅ HANYA ADMIN & SUPERADMIN
    children: [
      { name: "User Management", href: "/administrasi/users", icon: Users },
      { name: "Role Management", href: "/admin/roles", icon: Shield },
      { name: "System Settings", href: "/admin/settings", icon: Settings },
    ]
  },
  {
    name: "Hubinkom",
    icon: HelpCircle,
    roles: [], // ✅ Empty = semua user bisa akses
    children: [
      { name: "Help Center", href: "/help", icon: HelpCircle },
      { name: "Documentation", href: "/docs", icon: FileText },
      { name: "Contact Support", href: "/support", icon: User },
    ]
  },
  {
    name: "Kesiswaan",
    icon: FileText,
    roles: [], // ✅ Empty = semua user bisa akses
    children: [
      { name: "Data Siswa", href: "/kesiswaan/siswa", icon: Users },
    ]
  }
];

// Settings navigation
export const settingsNavigation = [
  { name: "Profile Settings", href: "/profile", icon: User },
  { name: "Account Settings", href: "/settings", icon: Settings },
  { name: "Preferences", href: "/preferences", icon: Settings },
];

// CSS classes for smooth transitions
export const transitionClasses = {
  dropdownContainer: "overflow-hidden transition-all duration-300 ease-in-out",
  dropdownContent: "transform transition-all duration-300 ease-in-out",
  chevronIcon: "transition-transform duration-200 ease-in-out",
  menuItem: "transition-all duration-200 ease-in-out transform",
  hoverScale: "hover:scale-105",
  hoverTranslate: "hover:-translate-y-0.5",
  activeSlide: "transition-all duration-200 ease-in-out",
  fadeIn: "animate-in fade-in duration-200",
  fadeOut: "animate-out fade-out duration-200",
  slideDown: "animate-in slide-in-from-top-2 duration-300",
  slideUp: "animate-out slide-out-to-top-2 duration-300",
  staggerChild: "animate-in slide-in-from-left-2 duration-300",
  staggerDelay: (index) => `delay-[${index * 50}ms]`
};

// Utility functions
export const getStaggerDelay = (index) => `delay-[${index * 50}ms]`;
export const getSlideDirection = (isOpen) => isOpen ? 'slideDown' : 'slideUp';
export const getFadeClass = (isVisible) => isVisible ? 'fadeIn' : 'fadeOut';