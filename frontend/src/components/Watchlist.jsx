import React, { useContext, useEffect, useState } from 'react'
import { WatchlistMoviesContext } from '../context/WatchlistContext'
import { API_KEY, imageUrl } from '../constants/Constants';
import { GoArrowUp, GoArrowDown } from "react-icons/go";
import movieInstance from './axios';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Watchlist() {
  const { watchlist, setWatchlist } = useContext(WatchlistMoviesContext);
  const [search, setSearch] = useState('');
  const [genrelist, setGenerList] = useState([]);
  const [genres, setGenres] = useState([]);
  const [clickedGenre, setClickedGenre] = useState({ id: 0, name: 'All Genres' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const removeWatchlistMovies = (movieData) => {
    let filterdMovies = watchlist.filter(movie => movie.id !== movieData.id);
    localStorage.setItem('watchlisted', JSON.stringify(filterdMovies));
    setWatchlist(filterdMovies);
  }

  const sortAscending = () => {
    let ascending = watchlist.sort((firstMovie, secondMovie) => firstMovie.vote_average - secondMovie.vote_average)
    setWatchlist([...ascending]);
  }

  const sortDescending = () => {
    let descending = watchlist.sort((firstMovie, secondMovie) => secondMovie.vote_average - firstMovie.vote_average)
    setWatchlist([...descending]);
  }

  const getGenreList = () => {
    movieInstance.get(`genre/movie/list?api_key=${API_KEY}`).then(response => {
      setGenerList(response.data.genres)
    }).catch(error => {
      console.error('Error fetching genres:', error);
    })
  }

  const getAllGenres = () => {
    let genres = watchlist.map(movieObj => {
      return genrelist.find(genre => genre.id === movieObj.genre_ids[0])
    })
    setGenres([{ id: 0, name: 'All Genres' }, ...genres]);
  }

  const uniqueGenres = Array.from(new Set(genres));

  const handleClickGenre = (genre) => {
    setClickedGenre(genre);
  };

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3001/user/watchlist').then(response => {
      if (response.data.status) {
        setWatchlist(JSON.parse(localStorage.getItem('watchlisted')));
        getGenreList();
      } else {
        navigate('/login');
      }
    }).catch(error => {
      console.error('error occured', error);
    }).finally(() => {
      setLoading(false);
    })
  }, []);

  useEffect(() => {
    if (genrelist.length > 0) {
      getAllGenres();
    }
  }, [watchlist, genrelist])

  return (
    <div className='p-5'>
      {loading ? (
        <div className="flex items-center justify-center h-[80vh] w-full">
          <div role="status">
            <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className='flex justify-center'>
            {uniqueGenres.map(genre => {
              return (
                <div key={genre.id} onClick={() => handleClickGenre(genre)} className={clickedGenre.name === genre.name ? 'h-[2.5rem] w-[9rem] bg-blue-600/60 rounded-xl text-white flex justify-center items-center mr-5 cursor-pointer text-sm sm:text-sm md:text-lg text-center p-1' : 'bg-gray-400/60 h-[2.5rem] w-[9rem] rounded-xl text-white text-sm sm:text-sm md:text-lg flex justify-center items-center text-center mr-5 cursor-pointer p-1'}>
                  {genre.name}
                </div>
              )
            })}
          </div>

          <div className='text-center mt-5'>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className='p-3 outline-none h-[3rem] w-[20rem] bg-gray-200' placeholder='Search movie' />
          </div>

          <div className='mt-5 border border-slate-200 rounded-xl overflow-hidden'>
            {watchlist.length > 0 ? (
              <table className='w-full text-center text-gray-500'>
                <thead className='border-b-2'>
                  <tr>
                    <th className='hidden md:block'>Poster</th>
                    <th>Name</th>
                    <th className='flex items-center justify-center'>
                      <div className='font-bold text-2xl cursor-pointer' onClick={sortAscending}><GoArrowUp /></div>
                      <div>Rating</div>
                      <div className='font-bold text-2xl cursor-pointer' onClick={sortDescending}><GoArrowDown /></div>
                    </th>
                    <th className='hidden md:block'>Genre</th>
                  </tr>
                </thead>
                <tbody className=''>
                  {watchlist.filter(movie => {
                    if (clickedGenre.id != 0) {
                      return movie.genre_ids[0] === clickedGenre.id
                    } else {
                      return true
                    }
                  }).filter(movie => (movie.title || movie.name).toLowerCase().includes(search.toLowerCase())).map((movieObj) => {
                    const genre = genres.find(genre => genre.id === movieObj.genre_ids[0]);
                    return (
                      <tr key={movieObj.id} className='border-b-2'>
                        <td className='flex items-center justify-center p-5 hidden md:block'>
                            <img src={`${imageUrl + movieObj.poster_path}`} alt="movie poster" className='bg-cover bg-center h-[8rem] w-[10rem] mx-auto' />
                        </td>
                        <td>{movieObj.title || movieObj.name}</td>
                        <td>{Math.round(movieObj.vote_average * 10) / 10}</td>
                        <td className='hidden md:block'>{genre ? genre.name : ''}</td>
                        <td onClick={() => removeWatchlistMovies(movieObj)} className='text-red-700'>
                          <div className='cursor-pointer'>Delete</div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div className='w-full text-center text-gray-500'>No movies in watchlist</div>
            )}
          </div>
        </>
      )}

    </div>
  )
}

export default Watchlist