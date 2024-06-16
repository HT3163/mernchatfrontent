import { io } from "socket.io-client";
import React from "react";
const SOCKET_URL = "https://mernchat-backend-b97caa5ceba8.herokuapp.com"; //backend_URL
export const socket = io(SOCKET_URL);
// app context
export const AppContext = React.createContext();
