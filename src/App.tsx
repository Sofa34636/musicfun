import './App.css'
import {useEffect, useState} from "react";
import type {TrackDataItem, TracksResponse} from "./types.ts";

function App() {

    const [tracks, setTracks] = useState<TrackDataItem[]>([])


    useEffect(() => {
        fetch('https://musicfun.it-incubator.app/api/1.0/playlists/tracks', {
            headers: {
                'API-KEY': '96073eef-87a0-4cd6-b4e1-a91ee7d115d6', // по ключу подключение
            }
        })
            .then(res => res.json() as  Promise<TracksResponse>) // результат прервращаем в джейсон
            .then(json => {
                console.log(json)
                setTracks(json.data); // помещаем все данные в  tracks
            })

    }, [])

    return (
        <div>
            <h1>Music Fun</h1>
            <ul>
                {tracks.map((track) => {
                    return (
                        <li>
                            <h4>{track.attributes.title}</h4>
                            <audio src={track.attributes.attachments[0].url}
                                   controls={true}
                            />
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}


export default App
