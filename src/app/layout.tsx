"use client"

import { CssVarsProvider } from "@mui/joy/styles";
import { Divider } from "@mui/joy";

import "@fontsource/inter";
import "rsuite/dist/rsuite-no-reset.min.css";
import "./globals.css";

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </head>
      <body>
        <CssVarsProvider>
          <div style={{display: "flex", flexDirection: "column", height: "100svh"}}>
            <div style={{flex: 1}}>
            {children}
            </div>
            <div style={{textAlign: "center"}}>
              <Divider />
              Uicons by <a href="https://www.flaticon.com/uicons">Flaticon</a>
            </div>
          </div>
        </CssVarsProvider>
      </body>
    </html>
  );
}
