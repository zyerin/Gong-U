import React from 'react';
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import slide1 from '../../images/slide1.jpg';
import slide2 from '../../images/slide2.jpg';
import slide3 from '../../images/slide3.jpg';
import logo from '../../images/logo.jpg';

const MainPage = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  const images = [
    slide1,
    slide2,
    slide3
  ];

  // <div className="relative h-screen overflow-hidden">
  return (
    <div className="h-screen overflow-hidden">
      <Slider {...settings} className="absolute inset-0 z-0">
        {images.map((image, index) => (
          <div key={index} className="w-full h-screen">
            <img src={image} alt={`slide-${index}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </Slider>
      <div className="absolute inset-0 flex flex-col justify-center items-center bg-black bg-opacity-60 text-[#f4dfee]">
        <div className="max-w-screen-lg mx-auto px-6">
          
          <p className="text-5xl font-semibold text-center">
            이제는 원하는 공간을
          </p>
          <p className="text-5xl font-semibold mt-7 text-center">
            원하는 시간만큼만 공유하자!
          </p>
          <div className="mt-12 flex items-center justify-center">
            <Link to="/host" className="mx-4">
              <button className="px-7 py-4 bg-[#64748B] text-white text-3xl font-semibold border-none rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:bg-[#475569] hover:-translate-y-2 hover:shadow-2xl">
                Host
              </button>
            </Link>
            <Link to="/guest/reservation1" className="mx-4">
              <button className="px-7 py-4 bg-[#64748B] text-white text-3xl font-bold border-none rounded-full cursor-pointer transition duration-300 ease-in-out transform hover:bg-[#475569] hover:-translate-y-2 hover:shadow-2xl">
                Guest
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
