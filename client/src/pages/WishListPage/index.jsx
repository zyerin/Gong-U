import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getWishListItems, removeWishlistItem } from '../../redux_store/thunkFunc';
import WishListTable from './Sections/WishListTable';
import './index.css';

const WishListPage = () => {
  const userData = useSelector(state => state.user?.userData);
  const wishlistDetail = useSelector(state => state.user?.wishlistDetail);
  const dispatch = useDispatch();

  useEffect(() => {
    let wishlistItemIds = [];
    if (userData?.wishlist && userData.wishlist.length > 0) {
      userData.wishlist.forEach(item => {
        wishlistItemIds.push(item.id);
      });
      const body = {
        wishlistItemIds,
        userWishlist: userData.wishlist
      };
      dispatch(getWishListItems(body));
    }
  }, [dispatch, userData]);

  const handleRemoveWishlistItem = (placeId) => {
    dispatch(removeWishlistItem(placeId));
  };

  const handleBulkRemove = async (selectedIds) => {
    for (const placeId of selectedIds) {
      await dispatch(removeWishlistItem(placeId));
    }
  };

  return (
    <section>
      <div className='flex justify-center m-7'>
        <h2 className='text-black'>
          <div className='text-2xl font-md'>WISHLIST</div>
        </h2>
      </div>

      {wishlistDetail?.length > 0 ?
        <>
          <WishListTable places={wishlistDetail} onRemoveItem={handleRemoveWishlistItem} onBulkRemove={handleBulkRemove} />
          
        </>
        :
        <div className="empty-cart">
          <div>
            <p className="empty-cart-text">위시리스트가 비어있습니다.</p>
            <Link to="/guest/reservation1" className="text-gray-500">상품 추가하러 가기</Link>
          </div>
        </div>

      }
    </section>
  );
};

export default WishListPage;
