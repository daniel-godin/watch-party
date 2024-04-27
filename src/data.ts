interface movie {
	title: string;
	// id: string;
	// links: {
	// 	trailer: string;
	// 	tmdb: string;
	// };
}

type favoriteTVShow = {
	
}

type tvShow = {
	id: number,
	title: string,
	overview: string,
	numOfSeasons: number,
	numOfEpisodes: number,
	watches: number,
	seasons: Array<tvSeason>,
}

type tvSeason = {
	season: number,
	complete: boolean,
	reWatches: number,
	numOfEpisodes: number,
	episodes: Array<tvEpisode>,

}

type tvEpisode = {
	episode: number, // 1-?? 
	season: number,
	episodeId: number,
	title: string,
	overview: string,
	airDate: string,
	watched: boolean,
}