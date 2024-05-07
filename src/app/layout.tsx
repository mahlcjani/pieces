
import { CssVarsProvider } from "@mui/joy/styles";
import { Divider } from "@mui/joy";
import "@fontsource/inter";
import "rsuite/dist/rsuite-no-reset.min.css";
import "./globals.css";

import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';

import { createTheme, MantineProvider } from '@mantine/core';
import { ColorSchemeScript } from '@mantine/core';

const theme = createTheme({

});

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>Pieces</title>
        <ColorSchemeScript />
      </head>
      <body>
        <CssVarsProvider>
          <MantineProvider theme={theme}>
            <div style={{display: "flex", flexDirection: "column", height: "100svh"}}>
              <div style={{flex: 1}}>
              {children}
              </div>
              <div style={{textAlign: "center"}}>
                <Divider />
                Uicons by <a href="https://www.flaticon.com/uicons">Flaticon</a>
              </div>
            </div>
          </MantineProvider>
        </CssVarsProvider>
      </body>
    </html>
  );
}


