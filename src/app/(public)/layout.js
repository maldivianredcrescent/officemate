import "../globals.css";

export const metadata = {
  title: "Office Mate",
  description:
    "Office Mate is a comprehensive platform designed to enhance workplace efficiency and collaboration.",
};

export default async function Layout({ children }) {
  return (
    <html lang="en">
      <body>
        <div>{children}</div>
      </body>
    </html>
  );
}
