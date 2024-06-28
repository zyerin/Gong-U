import React from 'react'

const CheckBox = ({ continents, checkedContinents, onFilters }) => {
    const handleToggle = (continentId) => { 

        // 체크박스에 체크한 것들의 아이디가 같은 것을 인덱스 넣어줌 
        const currentIndex = checkedContinents.indexOf(continentId);

        // State는 바로 수정하면 안 됨 -> 불변성을 지키기 위해 State를 새롭게 복사
        const newChecked = [...checkedContinents];

        // 현재 누른 checkbox가 이미 누른 checkbox 인지 체크
        if (currentIndex === -1) {  // index가 없으면 = 새로 클릭
            newChecked.push(continentId); // 새롭게 누르면 id 넣어줌

        } else { 
            // 전체 Checked된 State에서 현재 누른 Checkbox가 이미 있다면
            newChecked.splice(currentIndex, 1); // 이미 체크한 체크박스 다시 누르면 splice 이용해서 제거
            // 예) newChecked[1, 2, 3, 4] -> [1, 2, 4]으로
        }

        onFilters(newChecked); // onFilters 함수에 넣어서 호출해주면 됨

    }

    // 배열에 input과 label을 map 메소드를 이용해서 하나씩 랜더링해줌
    return (
        <div className='p-2 mb-3 bg-gray-100 rounded-md'>
            {continents?.map(continent => (
                <div key={continent._id}>
                    {/* input(체크박스) 누르면 handleToggle 함수 호출 */}
                    <input
                        type='checkbox'
                        onChange={() => handleToggle(continent._id)}
                        checked={checkedContinents.indexOf(continent._id) === -1 ? false : true}
                    />{" "}
                    <label>{continent.name}</label>
                </div>
            ))}
        </div>
    )
}

export default CheckBox