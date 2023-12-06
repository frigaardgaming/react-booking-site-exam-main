import React from "react";
import Footer from "../molecules/Footer";
import Header from "../molecules/Header";
import Menu from "../molecules/Menu";

export default function DefaultLayout({ children }) {
    return (
        <div>
            <Header />
            <Menu />
            {children}
            <Footer />
        </div>
    );
}
