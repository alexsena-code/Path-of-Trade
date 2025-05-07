/**
 * v0 by Vercel.
 * @see https://v0.dev/t/usXPLuIE2xp
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Image from "next/image";
import Link from "next/link";
import { JSX, SVGProps } from "react";
import { ThemeSwitcher } from "./theme-switcher";

export default function Footer() {
  return (
    <footer className="grid grid-cols-4 items-start w-screen  mt-12 py-4 bg-black/40 text-white px-10 gap-x-8">
      <div className="flex flex-col items-center space-y-4 ">
        <Image
          src="/images/logo.png"
          height="60"
          width="96"
          alt="Company Logo"
          style={{ aspectRatio: "200/100", objectFit: "cover" }}
        />
        <div className="flex space-x-4">
          <Link href="#" prefetch={false}>
            <FacebookIcon className="h-6 w-6 text-white" />
          </Link>
          <Link href="#" prefetch={false}>
            <TwitterIcon className="h-6 w-6 text-white" />
          </Link>
          <Link href="#" prefetch={false}>
            <InstagramIcon className="h-6 w-6 text-white" />
          </Link>
          <Link href="#" prefetch={false}>
            <DiscordIcon />
          </Link>
          
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <h3 className="font-bold">MAIN</h3>
        <Link
          href="#"
          className="text-gray-300 hover:text-white"
          prefetch={false}
        >
          Home
        </Link>
        <Link
          href="#"
          className="text-gray-300 hover:text-white"
          prefetch={false}
        >
          About us
        </Link>

        <Link
          href="#"
          className="text-gray-300 hover:text-white"
          prefetch={false}
        >
                        <ThemeSwitcher />
        </Link>
      </div>
      <div className="flex flex-col space-y-2">
        <h3 className="font-bold">SUPPORT</h3>
        <Link
          href="#"
          className="text-gray-300 hover:text-white"
          prefetch={false}
        >
          Contact us
        </Link>
      </div>
      <div className="flex flex-col space-y-2">
        <h3 className="font-bold">LEGAL</h3>
        <Link
          href="#"
          className="text-gray-300 hover:text-white"
          prefetch={false}
        >
          Privacy Policy
        </Link>
        <Link
          href="#"
          className="text-gray-300 hover:text-white"
          prefetch={false}
        >
          Term of service
        </Link>
        <Link
          href="#"
          className="text-gray-300 hover:text-white"
          prefetch={false}
        >
          Refund Policy
        </Link>
      </div>
      <div className="col-span-4 text-center mt-6">
        <p className="text-sm">{`\u00A9 2025 Path of Trade. All rights reserved.`}</p>
      </div>
    </footer>
  );
}

function FacebookIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="currentColor"
      className="bi bi-discord"
      viewBox="0 0 16 16"
    >
      <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
    </svg>
  );
}

function TwitterIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  );
}
