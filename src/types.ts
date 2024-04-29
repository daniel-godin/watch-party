// This is where all my Types & Interfaces live.  With detailed explainations and exported to the files that need them.

type watchParty = {
    watchPartyID: string,
    dateCreated: any,
    dateOfWatchParty: string,
    locationOfWatchParty: string,
    guests: Array<string>
}

type watchPartyTitle = {
    id: string,
    title: string,
    posterPath: string,
    runtime: number,
    description: string

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