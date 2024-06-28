import React, { useEffect, useState } from 'react'
import CheckBox from './Sections/CheckBox'
import RadioBox from './Sections/RadioBox'
import SearchInput from './Sections/SearchInput'
import CardItem from './Sections/CardItem'
import axiosInstance from '../../utils/axios';
import { continents, prices } from '../../utils/filterData'

const LandingPage = () => {

  const limit = 4; // limit의 개수에 따라서 한 번에(더보기 누르면) 몇 개의 카드(상품)을 가져올 것인지
  const [searchTerm, setSearchTerm] = useState(''); // 검색 기능에서 검색하는 값(입력값) 기억하기 위해 state 생성
  const [products, setProducts] = useState([]); // products 데이터들을 가지고있는(기억하고 있는) 배열
  const [skip, setSkip] = useState(0); // 처음에는 0부터 시작 이후에 +4
  const [hasMore, setHasMore] = useState(false); // 더 가져올 데이터가 있을 때만 더보기 버튼 보여줌
  const [filters, setFilters] = useState({ // 상품 필터링을 위해 필요한 State
    continents: [], // 체크박스 컴포넌트 내려줄 때 props로 제공
    price: []
  })


  // 처음에 보여줄 product 데이터들을 가져오기 ... How?
  // useEffect로 처음에 데이터를 가져오기 위해서, fetchProducts 라는 함수를 생성
  useEffect(() => {
    fetchProducts({ skip, limit }); // skip=0, limit=4 보냄
  }, []) // DependencyArray에 빈 값을 넣어서 한 번만 랜더링이 될 수 있게!!


  // 이 함수에서 백앤드에 요청을 보내서 데이터를 가져옴!!
  const fetchProducts = async ({ skip, limit, loadMore = false, filters = {}, searchTerm = "" }) => {
    // 요청 보낼 때 params 같이 보냄
    const params = {
      skip,
      limit,
      filters,
      searchTerm
    }

    try {
        // 백앤드에게 get 요청 보냄
        const response = await axiosInstance.get('/products', { params }) // products.js의 '/ '경로로 요청 보냄
        
        // 백앤드에서 받아오는 response를 product state에 하나씩 넣어줌 -> Card 나열 가능
        if (loadMore) {
            // 원래 있던 product에 새로 추가된 product 더해줌
            setProducts([...products, ...response.data.products])
        } else {
            // 함수가 loadMore=false로 params 받아옴
            // -> loadMore이 false라는 것은 처음에 랜딩페이지 들어왔을 때!
            setProducts(response.data.products); // 이때는 product를 추가로 더해주는게 아니라 그냥 업데이트
        }
        //hasMore state 업데이트
        // product 아직 더 가져올게 남아있으면 true, 없으면 false
        setHasMore(response.data.hasMore);
    } catch (error) {
        console.error(error);
    }
  }

  // 더 보기 버튼을 클릭하면 호출되는 함수
  const handleLoadMore = () => { // skip=0, limit=4
    const body = {
      skip: skip + limit, // 처음 가져온 4개의 product는 skip ... 이후 skip 계속 누적
      limit, // limit=4로 고정(더보기 누르면 4개씩 보여줌)
      loadMore: true,
      filters, // 필터링 조건을 filters state에 넣어줘야함
      searchTerm
    }
    fetchProducts(body); // 상품을 가져오는 함수 호출하여 백앤드에 요청 보냄
    setSkip(skip + limit) // skip 누적
  }

  // checkbox 컴포넌트에서 받아온 Checked State을 업데이트 해준다
  const handleFilters = (newFilteredData, category) => {
    const newFilters = { ...filters }; // filters state을 새롭게 복사(불변성 위해)
    newFilters[category] = newFilteredData; // 예) filters['continents'] = [1,2,3] ... 데이터 넣어줌

    // 예) filters['price'] = [200, 249] ... 실제 array 값 넣어줘야함 -> handlePrice
    if (category === 'price') {
      const priceValues = handlePrice(newFilteredData); // handlePrice 함수 호출
      newFilters[category] = priceValues
    }

    // 필터링 된 것을 백앤드에 요청해서 그에 맞는 데이터를 가져와야함
    // -> showFilteredResults 함수를 통해 fetchProducts 호출해서 백앤드에 요청 보냄!!
    showFilteredResults(newFilters); 

    // 새로 바뀐 filters를 업데이트
    setFilters(newFilters); // 예) [1,2,3]->[1,2,3,4]
  }

  // prices의 array 값 가져오기
  const handlePrice = (value) => {
    let array = [];

    for (let key in prices) {
      if (prices[key]._id === parseInt(value, 10)) { // value를 숫자로 변경
        array = prices[key].array // prices의 [key(_id)]의 array 값
      }
    }
    return array; // priceValues
  }

  // 필터링 된 것을 백앤드에 요청 -> fetchProducts 호출
  const showFilteredResults = (filters) => {
    console.log(filters);
    const body = {
      skip: 0, // 더 보기 있어도 만약 필터를 새롭게 조정한다면 다시 처음부터 가져오므로
      limit,
      filters,
      searchTerm
    }

    // product 가져옴
    fetchProducts(body);
    setSkip(0);
  }

  // SearchInput 컴포넌트에서 타이핑을 할 때마다 호출
  const handleSearchTerm = (event) => {
    const body = {
      skip: 0, // 0부터 다시 시작
      limit,
      filters, // checkbos, radiobox 체크한거 넣어줌
      searchTerm: event.target.value // 검색창에 타이핑하는 값
    }
    setSkip(0);
    setSearchTerm(event.target.value); // state 업데이트
    fetchProducts(body); // 백앤드에 요청 보내서 product 가져옴
  }


  return (
    <section>
      <div className='text-center m-7'>
        <h2 className='text-2xl'>여행 상품 사이트</h2>
      </div>
      {/* Filter */}
      <div className='flex gap-3'>
        <div className='w-1/2'>
          {/* checkedContinents ⇰ CheckBox에서 체크한 것들을 continents 배열에 넣어줌 
            ... 얘를 업데이트 해줄 함수 handleFilters */}  
          <CheckBox continents={continents} checkedContinents={filters.continents}
            onFilters={filters => handleFilters(filters, "continents")}
          />
        </div>
        <div className='w-1/2'>
          <RadioBox prices={prices} checkedPrice={filters.price}
            onFilters={filters => handleFilters(filters, "price")}
          />
        </div>
      </div>

      {/* Search */}
      <div className='flex justify-end mb-3'>
        <SearchInput searchTerm={searchTerm} onSearch={handleSearchTerm} />
      </div>


      {/* Card */}
      {/* products 배열을 이용해서 여러 개의 카드 아이템을 순회하며 나열 */}
      <div className='grid grid-cols-2 gap-4 sm:grid-cols-4'>
        {products.map(product =>
          <CardItem product={product} key={product._id} />
        )}
      </div>

      {/* LoadMore */}
      {hasMore &&
        <div className='flex justify-center mt-5'>
          <button
            onClick={handleLoadMore}
            className='px-4 py-2 mt-5 text-white bg-black rounded-md hover:bg-gray-500'>
            더 보기
          </button>
        </div>
      }
    </section>
  )
}

export default LandingPage