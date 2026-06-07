import "./globals.css";

export const metadata = {
  title: "WorkFusion | One Platform For Every Skill",
  description: "AI-Powered Hybrid Employment Marketplace connecting employers with remote freelancing and physical service seekers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-white selection:text-black">
        {children}
      </body>
    </html>
  );
}
