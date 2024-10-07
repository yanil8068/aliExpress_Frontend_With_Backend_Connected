import React from "react";
import { FaInstagram, FaFacebookSquare, FaTwitter } from "react-icons/fa";
import { FaFacebookMessenger } from "react-icons/fa6";
import { IoLogoWhatsapp } from "react-icons/io";

const FooterComponent = () => {
  return (
    <footer className="w-full flex flex-col items-center bg-gray-100 text-gray-700">
      {/* Main content section */}
      <div className="w-full max-w-screen-xl px-6 lg:px-16 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 text-sm">
        {/* Left Section: Customer service, Shopping with us, Collaborate */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Column 1: Customer service */}
            <div>
              <h3 className="font-bold mb-2">Customer service</h3>
              <ul className="space-y-1">
                <li>Help Center</li>
                <li>Transaction Services</li>
                <li>Agreement for non-EU/UK Consumers</li>
                <li>Terms and Conditions for EU/EEA/UK Consumers</li>
                <li>Take our feedback survey</li>
              </ul>
            </div>

            {/* Column 2: Shopping with us */}
            <div>
              <h3 className="font-bold mb-2">Shopping with us</h3>
              <ul className="space-y-1">
                <li>Making payments</li>
                <li>Delivery options</li>
                <li>Buyer Protection</li>
              </ul>
            </div>

            {/* Column 3: Collaborate with us */}
            <div>
              <h3 className="font-bold mb-2">Collaborate with us</h3>
              <ul className="space-y-1">
                <li>Partnerships</li>
                <li>Affiliate program</li>
                <li>Seller Log In</li>
                <li>Non-Chinese Seller Registration</li>
              </ul>
            </div>

            {/* Payment & Social Media */}
            <div>
              <div>
                <h3 className="font-bold mb-2">Pay with</h3>
                <p>Visa, MasterCard, PayPal, etc.</p>
              </div>
              <div className="mt-4">
                <h3 className="font-bold mb-2">Stay connected</h3>
                <div className="flex space-x-4 text-lg">
                  <FaInstagram className="cursor-pointer hover:text-gray-900" />
                  <FaFacebookSquare className="cursor-pointer hover:text-gray-900" />
                  <FaTwitter className="cursor-pointer hover:text-gray-900" />
                  <FaFacebookMessenger className="cursor-pointer hover:text-gray-900" />
                  <IoLogoWhatsapp className="cursor-pointer hover:text-gray-900" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Help, Browse by Category, AliExpress Multi-Language Sites, Alibaba Group */}
        <div className="space-y-8">
          {/* Help */}
          <div>
            <h3 className="font-bold mb-2">Help</h3>
            <p>
              Help Center, Disputes & Reports, Buyer Protection, Report IPR
              infringement, Integrity Compliance, Transparency Center.
            </p>
          </div>

          {/* Browse by Category */}
          <div>
            <h3 className="font-bold mb-2">Browse by Category</h3>
            <p>All Popular Products, Promotions, Great Value, Reviews.</p>
          </div>

          {/* AliExpress Multi-Language Sites */}
          <div>
            <h3 className="font-bold mb-2">AliExpress Multi-Language Sites</h3>
            <p>
              Russian, Portuguese, Spanish, French, German, Italian, Dutch,
              Turkish, Japanese, Korean, Thai, Vietnamese, Arabic, Hebrew,
              Polish.
            </p>
          </div>

          {/* Alibaba Group */}
          <div>
            <h3 className="font-bold mb-2">Alibaba Group</h3>
            <p>
              Alibaba Group Website, AliExpress, Alimama, Alipay, Fliggy,
              Alibaba Cloud, Taobao, etc.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="w-full bg-black text-white text-xs lg:text-sm py-4 flex justify-center items-center px-4 lg:px-28 text-center">
        Intellectual Property Protection - Privacy Policy - Sitemap - Terms of
        Use - Information for EU consumers - © 2010-2024 AliExpress.com. All
        rights reserved.
      </div>
    </footer>
  );
};

export default FooterComponent;
