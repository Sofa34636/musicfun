import type {TrackResponse, TracksResponse} from "./types.ts";

export const api = {
    getTracks() {
         return   fetch('https://musicfun.it-incubator.app/api/1.0/playlists/tracks', {
            headers: {
                'API-KEY': '96073eef-87a0-4cd6-b4e1-a91ee7d115d6', // по ключу подключение
            }
        })
            .then(res => res.json() as Promise<TracksResponse>) // результат превращаем в джейсон

    },
    getTrack(trackId: string, signal?: AbortSignal) {
       return  fetch(`https://musicfun.it-incubator.app/api/1.0/playlists/tracks/` + trackId, { // достаем конкретный трек внутри плейлистов
            signal: signal,
            headers: {
                'API-KEY': '96073eef-87a0-4cd6-b4e1-a91ee7d115d6', // по ключу подключение
            }
        })
            .then(res => res.json() as Promise<TrackResponse>) // результат превращаем в джейсон
    }
}