import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // The three legacy service routes still render the old Tailwind design +
    // "DRAFT EXPERIENCE" chrome. Hide them until they are redesigned by sending
    // visitors to the home showcase. Exact-path only — the redesigned
    // /services/house-cleaning and /services/lawncare routes are NOT matched.
    return [
      { source: "/services", destination: "/#showcase", permanent: false },
      { source: "/services/pool", destination: "/#showcase", permanent: false },
      { source: "/services/pestcontrol", destination: "/#showcase", permanent: false },
    ];
  },
};

export default nextConfig;
