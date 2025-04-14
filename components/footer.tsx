import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-black text-white py-6 text-center">
      <div className="container mx-auto space-y-2">
        <p className="text-sm">&copy; {new Date().getFullYear()} InfinityLinkage.com</p>
        <p className="text-sm">All rights reserved.</p>
        <p className="text-sm">
          Powered by <a href="https://infinitylinkage.com" className="text-blue-400 hover:underline">InfinityLinkage</a>
        </p>
      </div>
    </footer>
  )
}

export default Footer