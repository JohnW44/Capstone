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
  console.log('API Key:', apiKey)
  useEffect(() => {
    dispatch(thunkAuthenticate()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <ModalProvider>
        <LoadScript googleMapsApiKey={apiKey} libraries={libraries}>
          <Navigation />
          {isLoaded && <Outlet />}
          <Modal />
        </LoadScript>
      </ModalProvider>
    </>
  );
}
