import Posts from "../Components/Posts";
import Footer from "../Components/Footer";
import { useEffect } from "react";
import Header from "../Components/Header"

export default function Home() {

    useEffect(function () {
        window.scrollTo(0, 0);
    }, [])

    return (
        <div>
            <Header />
            <Posts />
            <Footer />
        </div>
    )
}