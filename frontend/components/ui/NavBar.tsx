"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
export default function Navbar() {
    const router = useRouter()

  return (
    <nav className="bg-white ">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-gray-800">
          Task-Management
        </Link>


        {/* Menu Items */}
        <div className="flex items-center space-x-4">
          <Link href="/about" className="text-gray-600 hover:text-gray-800">
            About
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-800">
            Contact
          </Link>
          <Button onClick={()=>{router.push("/signin")}} variant="outline" className="hidden md:inline-block">
            Login
          </Button>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Button variant="outline">Menu</Button>
        </div>
      </div>
    </nav>
  )
}
