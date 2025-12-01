"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Contact", path: "/contact" },
    { label: "Pose", path: "/yoga-check" },
    { label: "Recommendation", path: "/yoga-recc" },
    { label: "About", path: "/about" },
  ];

  const handleNavigation = (path) => {
    router.push(path);
    setMenuOpen(false);
  };

  return (
    <div className="w-full flex justify-center">
      <nav
        className={`
            mt-4 rounded-full fixed z-20 transition-all duration-300 
            ${
              scrolled
                ? "bg-black/50 shadow-lg backdrop-blur-sm w-[90vw]"
                : "bg-transparent w-[100vw]"
            }
            `}
      >
        <div className="mx-auto flex items-center justify-between p-5 px-6 md:px-10 lg:px-16 relative">
          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            <button
              className="space-mono-bold text-base text-white hover:text-indigo-300"
              onClick={() => router.push("/contact")}
            >
              Contact
            </button>
            <button
              className="space-mono-bold text-base text-white hover:text-indigo-300"
              onClick={() => router.push("/yoga-check")}
            >
              Pose
            </button>
          </div>

          <div className="md:hidden w-6"></div>

          <button
            onClick={() => router.push("/")}
            className="logo font-bold px-2 py-5 text-2xl md:text-4xl absolute left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-300 to-purple-100 bg-clip-text text-transparent whitespace-nowrap"
          >
            Yoga Delight
          </button>

          <div className="hidden md:flex items-center gap-8 lg:gap-12">
            <button
              className="space-mono-bold text-base text-white hover:text-indigo-300"
              onClick={() => router.push("/yoga-recc")}
            >
              Recommendation
            </button>
            <button
              className="space-mono-bold text-base text-white hover:text-indigo-300"
              onClick={() => router.push("/about")}
            >
              About
            </button>
          </div>

          <button
            className="md:hidden text-white hover:text-indigo-300 z-30"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-md rounded-2xl shadow-xl mx-4 overflow-hidden">
            <div className="flex flex-col py-2">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  className="space-mono-bold text-left px-6 py-4 text-white hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors"
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
