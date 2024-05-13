import { createTheme, MantineProvider, ColorSchemeScript } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

import "@fontsource/inter";
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import "./globals.css";

const theme = createTheme({
  fontFamily: "Inter"
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
        <MantineProvider theme={theme}>
          <ModalsProvider>
            {children}
          </ModalsProvider>
        </MantineProvider>
      </body>
    </html>
  );
}


