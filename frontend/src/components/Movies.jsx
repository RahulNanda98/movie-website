import React, { useEffect, useState } from 'react'
import Moviecard from './Moviecard'
import { API_KEY } from '../constants/Constants';
import movieInstance from './axios';
import { CgArrowLongLeft, CgArrowLongRight } from "react-icons/cg";

function Movies() {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [movieList, setMovieList] = useState('now_playing');

    useEffect(() => {
        movieInstance.get(`movie/${movieList}?api_key=${API_KEY}&language=en-US&page=${page}`).then(response => {
            setMovies(response.data.results);
        }).catch(error => {
            console.error("Error fetching movies:", error);
        });
    }, [page, movieList])

    const handlePrevious = () => {
        { page > 1 ? setPage(page - 1) : page }
    }

    const handleNext = () => {
        setPage(page + 1);
    }
    return (
        <div className='pt-5 w-full'>
            <div className='text-xl font-bold text-center m-4'>
                <select className='cursor-pointer border-2 border-slate-300' value={movieList} onChange={(e) => setMovieList(e.target.value)}>
                    <option value="now_playing">Now Playing</option>
                    <option value="popular">Popular</option>
                    <option value="top_rated">Top Rated</option>
                </select>
            </div>
            <div className='flex justify-around items-center flex-wrap gap-y-5 px-5 mt-5'>
                {movies.map(movieData => {
                    return (
                        <Moviecard key={movieData.id} movieData={movieData} movieImage={movieData.poster_path} movieName={movieData.title || movieData.name} />
                    )
                })}
            </div>
            <div className='flex items-center justify-center py-2 mt-10 bg-gray-600/50'>
                <span className='cursor-pointer text-3xl mr-8' onClick={handlePrevious}><CgArrowLongLeft /></span>
                <span className='text-xl font-bold mr-8'>{page}</span>
                <span className='cursor-pointer text-3xl' onClick={handleNext}><CgArrowLongRight /></span>
            </div>
        </div>
    )
}

export default Movies