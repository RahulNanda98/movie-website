import React, { useContext, useEffect, useState } from 'react'
import { imageUrl } from '../constants/Constants'
import { IoAddOutline, IoCloseOutline } from "react-icons/io5";
import { WatchlistMoviesContext } from '../context/WatchlistContext';

function Moviecard({ movieImage, movieName, movieData }) {
  const { watchlist, setWatchlist } = useContext(WatchlistMoviesContext);

  const addWatchlistMovies = (movieData) => {
    let newMovie = [...watchlist, movieData]
    localStorage.setItem('watchlisted', JSON.stringify(newMovie));
    setWatchlist(newMovie);
  }

  const removeWatchlistMovies = (movieData) => {
    let filterdMovies = watchlist.filter(movie => movie.id !== movieData.id);
    localStorage.setItem('watchlisted', JSON.stringify(filterdMovies));
    setWatchlist(filterdMovies);
  }

  const isWatchlisted = watchlist.some(movie => movie.id === movieData.id);

  useEffect(() =>{
    setWatchlist(JSON.parse(localStorage.getItem('watchlisted')))
  }, [])

  return (
    <div className='h-[40vh] w-[200px] bg-cover bg-center rounded-3xl hover:scale-110 hover:cursor-pointer hover:duration-300 flex flex-col justify-between items-end' style={{ backgroundImage: `url(${imageUrl + movieImage})` }}>
      {isWatchlisted ?
        <div className='text-xl p-1 bg-gray-500/60 m-3 rounded-lg cursor-pointer hover:scale-110' onClick={() => removeWatchlistMovies(movieData)}>
          <IoCloseOutline className='text-red' />
        </div> :
        <div className='text-xl p-1 bg-gray-500/60 m-3 rounded-lg cursor-pointer hover:scale-110' onClick={() => addWatchlistMovies(movieData)}>
          <IoAddOutline className='text-white hover:text-black' />
        </div> }
      <div className='text-md bg-gray-500/60 text-center w-full text-white rounded-b-3xl p-2'>
        {movieName}
      </div>
    </div>
  )
}

export default Moviecard