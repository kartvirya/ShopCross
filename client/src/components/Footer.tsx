import { Mail, Phone, Facebook, Instagram, Twitter } from "lucide-react";
import { ShoppingBag } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-primary-600" />
              <span className="ml-2 text-xl font-bold text-primary-700">NepalShippr</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">Making cross-border shopping between India and Nepal transparent and hassle-free.</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Resources</h3>
            <ul className="mt-4 space-y-4">
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Customs Regulations</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Shipping Guidelines</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Restricted Items</a></li>
              <li><a href="#" className="text-base text-gray-500 hover:text-gray-900">Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Contact</h3>
            <ul className="mt-4 space-y-4">
              <li className="flex">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-500">support@nepalshippr.com</span>
              </li>
              <li className="flex">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />
                <span className="text-gray-500">+977-01-4567890</span>
              </li>
            </ul>
            <div className="mt-8 flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-200 pt-8">
          <p className="text-base text-gray-400 text-center">&copy; {new Date().getFullYear()} NepalShippr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
