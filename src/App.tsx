import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import QRCodeGenerator from "./components/QRCodeGenerator";

function App() {
  return (
    <MantineProvider
      defaultColorScheme="dark"
      theme={{
        primaryColor: "blue",
        fontFamily: "Inter, sans-serif",
        components: {
          Button: {
            defaultProps: {
              size: "md",
              variant: "filled",
            },
          },
        },
      }}
    >
      <Notifications position="top-right" />
      <QRCodeGenerator />
    </MantineProvider>
  );
}

export default App;
