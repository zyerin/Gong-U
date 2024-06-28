import React from 'react'
import { Link } from 'react-router-dom';
import ImageSlider from '../../../components/ImageSlider';

const CardItem = ({ place }) => {
    return (
        <div>
            <div className='rounded-t-lg overflow-hidden'>
                <ImageSlider images={place.images} />
            </div>
            <Link to={`/place/${place._id}`} className='block mt-2'>
                <p className='text-sm font-semibold'>{place.title}</p>
                <p className='text-sm text-gray-700'>{place.location} | 최대 {place.maxPeople}명 | 기본요금 {place.minPrice} klay</p>
                <p className='text-sm text-gray-700'>{place.price} klay/시간 당</p>
            </Link>
        </div>
    )
}

export default CardItem
