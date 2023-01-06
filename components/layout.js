// components/layout.js

import NavBar from './navbar'
import LoginModal from "./LoginModal";
//import Footer from './footer'

export default function Layout({ children }) {
    return (
        <>
            <NavBar />
            <LoginModal />
            <main>{children}</main>
            {/* <Footer /> */}
        </>
    )
}
