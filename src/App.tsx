import { RouterProvider } from "react-router";
import { Flowbite, ThemeModeScript } from 'flowbite-react';
import customTheme from './utils/theme/custom-theme';
import router from "./routes/Router";
import { UserProvider } from "./contexts/UserContext";

function App() {
  return (
    <>
      <ThemeModeScript />
      <Flowbite theme={{ theme: customTheme }}>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
      </Flowbite>
    </>
  );
}

export default App;