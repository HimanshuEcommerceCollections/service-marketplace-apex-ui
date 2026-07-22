// Legacy chrome for the original /services/* routes (lawncare, pestcontrol,
// pool and the services index). Grouped under (legacy) so these routes keep the
// DemoBanner / Navbar / Footer + Tailwind globals, while the redesigned
// /services/house-cleaning route sits outside the group and ships its own chrome.
// The route-group name is not part of the URL, so the paths are unchanged.
import '../../globals.css';
import DemoBanner from '../../../components/HomeComponents/DemoBanner';
import Navbar from '../../../components/HomeComponents/Navbar';
import Footer from '../../../components/HomeComponents/Footer';

export default function ServicesLegacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoBanner />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
