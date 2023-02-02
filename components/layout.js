// components/layout.js

import NavBar from './navbar'
import LoginModal from "./LoginModal";
import {Container, Grid, Spacer} from "@nextui-org/react";
import Head from "next/head";
//import Footer from './footer'

export default function Layout({ children }) {
    // Create a 2x2 grid with a component in each cell using NextUI components
    return (
        <Container>
         <LoginModal />
         {children}
        </Container>
    )
}
