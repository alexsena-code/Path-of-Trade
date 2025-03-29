"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";


export default function Header() {




    return (
        <motion.header
            className="sticky top-0 z-50 bg-black/40 backdrop-blur-md"
            initial={{y: -100}}
            animate={{y: 0}}
            transition={{duration: 0.6}}
        >
            <nav className="mx-auto flex max-w-8xl items-center justify-between px-40 pt-3 lg:px-20 mb-6" aria-label="Global">
                {/* Left placeholder for potential future use */}
                <div className="flex-1">
                    {/* Can add additional left-side items if needed */}
                </div>

                {/* Centered Logo */}
                <div className=" flex justify-center">
                    <Link href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">Flowers & Saints</span>
                        <img
                            className="h-20 w-auto"
                            src="/images/logo.png"
                            alt="Path of Trade Logo"
                        />
                    </Link>
                </div>
                    <div className="flex-1 flex justify-end items-center space-x-4 p´x">
                        <Link
                            href="#"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-lg font-semibold leading-6 text-foreground hover:text-primary transition-colors"
                        >
                            <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn"/>
                            <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                        </Link>
                    </div>

            </nav>
        </motion.header>
)
}

