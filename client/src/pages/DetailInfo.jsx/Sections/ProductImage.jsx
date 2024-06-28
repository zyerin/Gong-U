import React, { useEffect, useState } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css'; // 기본 스타일 추가
import './Image.css'

const ProductImage = ({ place }) => {
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (place.images && place.images.length > 0) {
            let images = [];
            place.images.map(imageName => {
                return images.push({
                    original: `${import.meta.env.VITE_SERVER_URL}/${imageName}`,
                    thumbnail: `${import.meta.env.VITE_SERVER_URL}/${imageName}`,
                })
            })
            setImages(images)
        }
    }, [place]);

    return (
        <ImageGallery
            items={images}
            thumbnailPosition="right"
            showFullscreenButton={false} /*화면 꽉 차게 안나와서 비활성화 */
            showPlayButton={false}
            additionalClass="custom-image-gallery" 
            /*인덱스 변경 시 setCurrentIndex가 호출되어 currentIndex 상태가 업데이트 됨 */
            startIndex={currentIndex}
            onSlide={setCurrentIndex} 
        />
    )
}

export default ProductImage;
