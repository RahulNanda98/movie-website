import React, { useEffect, useState } from 'react'
import movieInstance from './axios'
import { API_KEY, imageUrl } from '../constants/Constants';

function Banner() {
  const [movie, setMovie] = useState();
  useEffect(() => {
    movieInstance.get(`trending/all/week?api_key=${API_KEY}&language=en-US`).then(response => {
      setMovie(response.data.results[Math.floor(Math.random()*20)]);
    }).catch(error => {
      console.error("Error fetching movies:", error);
    });
  }, [])
  
  return (
    <div className='h-[70vh] md:h-[85vh] w-full bg-cover bg-top flex items-end' style={{backgroundImage: `url(${movie ? imageUrl+movie.backdrop_path : ''})`}}>
        <div className='text-white text-xl font-bold bg-gray-500/60 w-full text-center p-1'>{movie ? movie.title || movie.name : ''}</div>
    </div>
  )
}

export default Banner