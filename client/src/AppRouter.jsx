import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import WelcomePage from './pages/WelcomePage';
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProductCard from "./components/ProductCard";
import ProductList from "./components/ProductList";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Hero from "./components/Hero";
import CategoryGrid from "./components/categoryGrid";

const AppRouter = () => {
    return(
        <Router>
            <Header/>
            <Routes>
                <Route path="/" element={<Hero/>}/>
                <Route path="/homePage" element={<HomePage/>}/>
                <Route path="/productDetails" element={<ProductDetails/>}/>
                <Route path="/productCard" element={<ProductCard/>}/>
                <Route path="/productList" element={<ProductList/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<Signup/>}/>
                <Route path="/explore" element={<CategoryGrid/>}/>
            </Routes>
            <Footer/>
        </Router>
    )
};

export default AppRouter;