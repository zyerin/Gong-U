import React from 'react'
import Dropzone from 'react-dropzone'
import axiosInstance from '../utils/axios';
import { VscNewFolder } from "react-icons/vsc";
import { CiImageOn } from "react-icons/ci";

const FileUpload = ({ onImageChange, images }) => {

  // 이미지를 업로드하고, 그 파일을 백앤드로 전달하기 위한 핸들링함수
  const handleDrop = async (files) => { // acceptedFile 받아옴, try-catch 블럭에서 await 하려면 async로 감싸줌
    let formData = new FormData(); // 파일 전달 -> FormData 이용

    // cofig에 헤더의 content-type으로 multipart/form-data 넣어줌
    const config = {
      header: { 'content-type': 'multipart/form-data' }
    }

    // formData에 key값은 file이라고 해주고 files[0] 더해줌
    // files[0]은 acceptedFiles의 정보 ... 콘솔에 뜸
    formData.append('file', files[0]); 

    // axios로 요청을 보낼 때, formdata랑 config랑 같이 넣어서 보냄 -> 백앤드에서 파일 받을 수 있음
    try {
      const response = await axiosInstance.post('/products/image', formData, config); // product.js의 image 경로로 라우트로 요청 보냄

      // 백앤드에서 이미지파일 이름을 response로 전달해줌
      // 원래 있던 이미지들의 배열에 response를 추가해주면 됨
      onImageChange([...images, response.data.fileName]); 
      // onImageChange는 UploadProductPage에서 내려줌
      // -> handleImages 함수가 호출됨 
      // -> 원래 있던 images[]에 하나 더 추가: ...images, response.data.fileName
      // 추가한 게 함수의 newImages로 들어가므로 images: newImages 통해 이미지 배열 업데이트 완료


    } catch (error) {
      console.error(error);
    }

  }

  // 이미지 클릭하면 호출됨(onClick)
  const handleDelete = (image) => { // 클릭한 image의 이름
    const currentIndex = images.indexOf(image); // 클릭한 이미지의 인덱스 반환
    let newImages = [...images]; // 원본 복사
    // state 자체의 불변성을 지켜주기 위해서 먼저 새롭게 생성한 다음에, splice 해줌
    // splice 메소드 자체가 원본을 바꾸는 것이기 때문에 새로 복사해준 다음에 지워줘야함 -> 불변성을 지켜주는 것
    newImages.splice(currentIndex, 1); // currentIndex부터 한 개 지움
    onImageChange(newImages); // 이미지 삭제한 newImages를 다시 넣어주면, 원본 배열에 있는 product 이미지가 변경됨(새로 업데이트됨)
  }


  return(
    <div className='flex gap-4'>

      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <section
            className='min-w-[300px] h-[300px] border flex items-center justify-center'
          >
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p className='text-3xl'><CiImageOn /></p>
            </div>
          </section>
        )}
      </Dropzone>

      <div className='flex-grow h-[300px] border flex  items-center justify-center overflow-x-scroll overflow-y-hidden'>
        {images.map(image => (
          <div key={image} onClick={() =>handleDelete(image)}>
            <img
              className='min-w-[300px] h-[300px]'
              src={`${import.meta.env.VITE_SERVER_URL}/${image}`}
              alt={image}
            />
          </div>
        ))}
      </div>

    </div>

  )
}

export default FileUpload