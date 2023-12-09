import "@/styles/globals.css";
import { M_PLUS_Rounded_1c } from "next/font/google";

const font = M_PLUS_Rounded_1c({ weight: "700", subsets: ["latin"] });

export default function App({ Component, pageProps }) {
  return (
    <main className={font.className}>
      <Component {...pageProps} />
    </main>
  );
}
