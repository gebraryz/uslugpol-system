import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <html lang="pl">
    <body>
      <main>{children}</main>
    </body>
  </html>
);

export default Layout;
