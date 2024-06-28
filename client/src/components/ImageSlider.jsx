import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import './style.css';

/*
// 여백있게
const ImageSlider = ({ images }) => {
    return (
        <Carousel showThumbs={false} showStatus={false} infiniteLoop>
            {images.map(image => (
                <div key={image} className='carousel-image-wrapper'>
                    <img
                        src={`${import.meta.env.VITE_SERVER_URL}/${image}`}
                        alt={image}
                        className='carousel-image'
                    />
                </div>
            ))}
        </Carousel>
    );
};
*/

// 꽉차게
const ImageSlider = ({ images }) => {
    return (
        <Carousel showThumbs={false} showStatus={false} infiniteLoop>
            {images.map(image => (
                <div key={image} className='carousel-image-wrapper2'>
                    <img
                        src={`${import.meta.env.VITE_SERVER_URL}/${image}`}
                        alt={image}
                        className='carousel-image2 w-full h-full object-cover rounded-lg'
                    />
                </div>
            ))}
        </Carousel>
    );
};
export default ImageSlider;
