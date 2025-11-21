"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar(){

    const [scrolled, setScrolled] = useState(false)
    const router = useRouter();

    useEffect(() => {
        const onScroll = () => {
        setScrolled(window.scrollY > 10)
        }
        window.addEventListener("scroll", onScroll)
        return () => window.removeEventListener("scroll", onScroll)
    }, [])
    
    return (
    <div className="w-full flex justify-center">
        <nav
            className={`
            mt-4 rounded-full fixed z-20 transition-all duration-300
            ${scrolled ? "bg-black/50 shadow-lg backdrop-blur-sm w-[90vw]" : "bg-transparent w-[100vw]"}
            `}
        >
            <div className="mx-auto flex items-center justify-between p-5 px-6 md:px-10 lg:px-16 relative">
                <div className="flex items-center gap-8 md:gap-12">
                <button className="montserrat-bold text-base text-white hover:text-indigo-300" onClick={() => router.push("/contact")}>Contact</button>
                <button className="montserrat-bold text-base text-white hover:text-indigo-300" onClick={() => router.push("/")}>Pose</button>
                </div>

                <button
                onClick={() => router.push("/")}
                className="zain-extrabold text-4xl md:text-5xl absolute left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-300 to-purple-100 bg-clip-text text-transparent"
                >
                Yoga Delight
                </button>

                <div className="flex items-center gap-8 md:gap-12">
                <button className="montserrat-bold text-base text-white hover:text-indigo-300" onClick={() => router.push("/yoga-recc")}>Reccomendation</button>
                <button className="montserrat-bold text-base text-white hover:text-indigo-300" onClick={() => router.push("/about")}>About</button>
                </div>
            </div>
        </nav>
    </div>
    );
}