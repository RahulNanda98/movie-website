import { createContext, useState } from "react";

export const WatchlistMoviesContext = createContext(null);

export function WatchlistContext ({children}) {
    const [watchlist, setWatchlist] = useState([]);

    return (
        <WatchlistMoviesContext.Provider value={{watchlist, setWatchlist}}>
            {children}
        </WatchlistMoviesContext.Provider>
    )
}

