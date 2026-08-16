import { model_context } from "../Context/ApiContext";
import { useContext } from "react";


export default function useAuth() {
    return useContext(model_context)
}