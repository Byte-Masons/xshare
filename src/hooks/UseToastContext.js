import { useContext } from "react";
import ToastContext from "../components/ToastContext";

export default function useToastContext() {
  return useContext(ToastContext);
}
