import { createBrowserRouter, RouterProvider } from "react-router-dom";
import About from "./pages/About";
import Home from "./pages/Home";
import Prediction from "./pages/Prediction";
import Visualization from "./pages/Visualization";

const ErrorBoundary = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
        <p className="text-gray-600">
          We're sorry, but there was an error loading this page.
        </p>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/predictions",
    element: <Prediction />,
    // errorElement: <ErrorBoundary />,
  },
  {
    path: "/visualization",
    element: <Visualization />,
    // errorElement: <ErrorBoundary />,
  },
  {
    path: "/about",
    element: <About />,
    // errorElement: <ErrorBoundary />,
  },
]);

function App() {
  return (
    <div className="min-h-screen bg-background">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
