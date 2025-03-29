import type {Metadata} from 'next'
import './globals.css'
import {ThemeProvider} from "@/components/providers/theme-provider";
import Header from "@/components/header";
import Footer from '@/components/footer';


export const metadata: Metadata = {
    title: 'Path of Trade',
    description: 'Path of Exile Trading Platform',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">

        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <Header/>

            <body className={`dark:bg-background bg-white dark:text-(--primary-font) text-black`}>
            {children}
            </body>
            <Footer/>
        </ThemeProvider>
        </html>
    )
}