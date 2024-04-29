
import { CssVarsProvider } from "@mui/joy/styles";
import { IntlProvider } from "react-intl";
import { Divider } from "@mui/joy";
import { messages } from "@/i18n/messages";
import "@fontsource/inter";
import "rsuite/dist/rsuite-no-reset.min.css";
import "./globals.css";

const defaultLocale = "en";

const supportedLocales = Object.keys(messages);
let locale = navigator.language;

while (!supportedLocales.includes(locale) && locale.length) {
    const i = locale.lastIndexOf("-");
    locale = i != -1 ? locale.substring(0, i) : "";
}

// fallback
if (!locale) {
  locale = defaultLocale;
}

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        <CssVarsProvider>
          {/*<IntlProvider messages={messages[locale]} locale={locale} defaultLocale={defaultLocale}>*/}
            <div style={{display: "flex", flexDirection: "column", height: "100svh"}}>
              <div style={{flex: 1}}>
              {children}
              </div>
              <div style={{textAlign: "center"}}>
                <Divider />
                Uicons by <a href="https://www.flaticon.com/uicons">Flaticon</a>
              </div>
            </div>
          {/*</IntlProvider>*/}
        </CssVarsProvider>
      </body>
    </html>
  );
}
