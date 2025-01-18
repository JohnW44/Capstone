import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ModalProvider, Modal } from "../context/Modal";
import { thunkAuthenticate } from "../redux/session";
import Navigation from "../components/Navigation/Navigation";
import { LoadScript } from "@react-google-maps/api";

const libraries =['places'];

export default function Layout() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const apiKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
  
  
  useEffect(() => {
    console.log('Environment Variables:', {
      apiKey,
      allEnv: import.meta.env
    });
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch, apiKey]);

  if (!apiKey) {
    console.error('No Google Maps API key found');
    return <div>Error: Google Maps API key not configured</div>;
  }

  return (
    <>
      <ModalProvider>
      <LoadScript 
          googleMapsApiKey={apiKey} 
          libraries={libraries}
          onError={(error) => console.error('Maps Error:', error)}
          onLoad={() => console.log('Maps Loaded')}
        >
          <Navigation />
          {isLoaded && <Outlet />}
          <Modal />
        </LoadScript>
      </ModalProvider>
    </>
  );
}
