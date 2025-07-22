import React from "react";
import { type IconType } from "react-icons";
import { FaFacebook, FaTiktok } from "react-icons/fa";

import { FaCreditCard } from "react-icons/fa6";

export const SITE_NAME = "GAME ZONE TECH";

export const CONTACTS = {
  email: "admin@donext.org",
  phone: "+94 70 123 4567",
  secondaryPhone: null,
  address: "Kandy, Sri Lanka"
};

export const SOCIALS: {
  social: string;
  icon: IconType;
  href: string;
}[] = [
  {
    social: "Facebook",
    href: "https://www.facebook.com/share/1BjJWUdUNS/?mibextid=wwXIfr",
    icon: FaFacebook
  },
  {
    social: "TikTok",
    href: "https://www.tiktok.com/@game.zone.tech?_t=ZS-8yEVVFWKfB4&_r=1",
    icon: FaTiktok
  }
];

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_stripe_stripe: {
    title: "Credit card",
    icon: <FaCreditCard />
  },
  pp_system_default: {
    title: "Manual Payment",
    icon: <FaCreditCard />
  }
};
