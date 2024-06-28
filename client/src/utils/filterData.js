// CheckBox, RadioBox를 위해 데이터 배열 생성

const continents = [
    {
        "_id": 1,
        "name": "서울"
    },
    {
        "_id": 2,
        "name": "여수"
    },
    {
        "_id": 3,
        "name": "제주도"
    },
    {
        "_id": 4,
        "name": "경주"
    },
    {
        "_id": 5,
        "name": "부산"
    },
    {
        "_id": 6,
        "name": "경기도"
    },
    {
        "_id": 7,
        "name": "인천"
    },
    {
        "_id": 8,
        "name": "속초"
    },
    {
        "_id": 9,
        "name": "강릉"
    },
    {
        "_id": 10,
        "name": "대전"
    },
    {
        "_id": 11,
        "name": "인천"
    }
    ,{
        "_id": 12,
        "name": "대구"
    }
]

const prices = [
    {
        "_id": 0,
        "name": "모두",
        "array": []
    },
    {   
        "_id": 1,
        "name": "0 ~ 199원",
        "array": [0, 199]
    },
    {
        "_id": 2,
        "name": "200 ~ 249원",
        "array": [200, 249]
    },
    {
        "_id": 3,
        "name": "250 ~ 279원",
        "array": [250, 279]
    },
    {
        "_id": 4,
        "name": "280 ~ 299원",
        "array": [280, 299]
    },
    {
        "_id": 5,
        "name": "300원 이상",
        "array": [300, 200000]
    }
]

// continents(대륙), prices(가격) 데이터 배열 생성 후 외부에서 사용을 위해 export 해줌
export {
    continents,
    prices
}
