import React from "react";
import heroImage from "../assets/images/hero.png";

const Home = () => {
    return (
        <div className="w-full h-auto flex flex-col">
            <section
                id="hero"
                className="bg-cover bg-top w-full h-screen flex items-center justify-center"
                style={{
                    backgroundImage: `url(${heroImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                }}
            >
                <div className="container mx-auto px-8 text-center">
                    <h1 className="text-4xl md:text-6xl text-white font-bold mb-4">
                        XTRA-MILE FREIGHT FORWARDING-INC
                    </h1>
                    <p className="text-lg md:text-2xl text-white mb-8">
                        Reliable and Efficient Freight Services
                    </p>
                    <button className="bg-red-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">
                        Get Started
                    </button>
                </div>
            </section>
            <section id="cta" className="bg-red-800 text-white py-12">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg md:text-xl mb-8">
                        Contact us today to learn more about our freight
                        services
                    </p>
                    <button className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl">
                        Contact Us
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;
