import { Link } from "wouter";
import { ShoppingBag } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/">
              <a className="flex-shrink-0 flex items-center cursor-pointer">
                <ShoppingBag className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-primary-700">NepalShippr</span>
              </a>
            </Link>
          </div>
          <div className="flex items-center">
            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">About</a>
            <a href="#" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">FAQ</a>
            <a href="#" className="ml-4 bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500">Contact</a>
          </div>
        </div>
      </div>
    </nav>
  );
}
