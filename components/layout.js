// These styles apply to every route in the application
import Nav from "./nav";
import Footer from "./footer";
import Sidebar from "./sidebar";

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <div>
      <Nav />
      <Sidebar />
      {children}
      <Footer />
    </div>
  );
}
