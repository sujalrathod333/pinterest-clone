import React from 'react'
import Image from "next/image";


const Comments = ({user, comment, profileImage}) => {
  return (
   <>
   <div className="flex items-center space-x-3 mb-4">
   <Image width={50} alt="avatar" height={50} src={profileImage} className="w-8 h-8 rounded-full object-cover" />
   </div>
   <div>
    <div className="flex flex-col">
   <h4 className='font-semibold text-sm'>{user}</h4>
   <p className='text-gray-700 text-sm'>{comment}</p>
    </div>
   </div>
   </>
  )
}

export default Comments