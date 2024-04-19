

export function getTMDBImage(size: string, path: string) {

    // Size Options:        
    //   "w92",
    //   "w154",
    //   "w185",
    //   "w342",
    //   "w500",
    //   "w780",
    //   "original"

    const baseTMDBPath = 'https://image.tmdb.org/t/p/';
    // size = 'w92'; // have it change variably later.

    return baseTMDBPath + size + path;
}