import './App.css'
import {useEffect, useRef, useState} from "react";
import type {TrackDataItem, TrackResponse, TracksResponse} from "./types.ts";

function App() {

    const [listQueryStatus, setQueryListStatus] = useState<'success' | 'loading'>('loading') // загрузка.FSM типо true\false,  но мы предпологаем, что будут дополнительные детали
    const [tracks, setTracks] = useState<TrackDataItem[] | null>(null) // треки

    const [detailQueryStart, setdetailQueryStart] = useState<'pending' | 'success' | 'loading'>('pending') // загрузка деталей
    const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null) // id выбранного трека

    const [selectedTrack, setSelectedTrack] = useState<TrackResponse | null>(null) // выбранный трек (данные)
    const abortControllerRef = useRef<null | AbortController>(null) // сохраняет ссылку

    useEffect(() => {  // Хук выполняется после первой отрисовки компонента.
        // Если передать пустой массив зависимостей [], эффект сработает только один раз (аналог componentDidMount).
        // Здесь выполняем запрос к API после монтирования компонента.

        fetch('https://musicfun.it-incubator.app/api/1.0/playlists/tracks', {
            headers: {
                'API-KEY': '96073eef-87a0-4cd6-b4e1-a91ee7d115d6', // по ключу подключение
            }
        })
            .then(res => res.json() as Promise<TracksResponse>) // результат превращаем в джейсон
            .then(json => {
                console.log(json)
                setTracks(json.data); // помещаем все данные в tracks
                setQueryListStatus('success') // убираем надпись загрузки
            })

    }, [])

    const handleSelectTrackClick = (trackId: string) => {
        setSelectedTrackId(trackId)  // сохраняем id выбранного трека
        setdetailQueryStart('loading') // включаем загрузку деталей, 'loading' - запрос делается

        abortControllerRef.current?.abort() // создаём контроллер для возможности отмены запроса. Экономия ресурса и мы не  дожидаетмся  окончания запроса, когда он  уже не нужен
        abortControllerRef.current = new AbortController()

        fetch(`https://musicfun.it-incubator.app/api/1.0/playlists/tracks/${trackId}`, { // достаем конкретный трек внутри плейлистов
            signal: abortControllerRef.current.signal,
            headers: {
                'API-KEY': '96073eef-87a0-4cd6-b4e1-a91ee7d115d6', // по ключу подключение
            }
        })
            .then(res => res.json() as Promise<TrackResponse>) // результат превращаем в джейсон
            .then(json => {
                console.log(json)
                setSelectedTrack(json); // помещаем данные выбранного трека
                setdetailQueryStart('success'); // убираем надпись загрузки,  'success' - запрос  пришел
            })
    }

    return (
        <div>
            <h1>Music Fun</h1>
            <div style={{display: 'flex', gap: '20px'}}>

                <ul>
                    {
                        listQueryStatus === 'loading' && <p>Loading...</p> // при первой отрисовке показываем Loading
                    }
                    {listQueryStatus === 'success' && tracks!.map((track) => { // при вызове 10 треков. Функция создается 1 раз, а вызывается 10 раз и каждый вызов получает на вход свой трек
                        const color = track.id === selectedTrackId ? "green" : "white"; // если id === id нажатого элемента, то меняем цвет
                        return (
                            <li key={track.id} style={{color: color}}>
                                <h4 onClick={() => handleSelectTrackClick(track.id)} // наблюдатель, который вызывается при клике
                                >
                                    {track.attributes.title}</h4>
                                <audio src={track.attributes.attachments[0]?.url}
                                       controls={true}
                                />
                            </li>
                        )
                    })}
                </ul>
                <div>
                    <h2>Detail</h2>
                    {detailQueryStart === 'loading' && <p>Loading...</p> // пока грузим детали показываем Loading
                    }
                    {detailQueryStart === 'success' // 'success' -  когда что-то есть,  показываем
                        && selectedTrack && // если трек выбран и детали загрузились — показываем их
                        <div>
                            <h3>{selectedTrack.data.attributes.title}</h3>
                            <div>{selectedTrack.data.attributes.likesCount}</div>
                            <div>{selectedTrack.data.attributes.lyrics}</div>
                        </div>}
                </div>
            </div>
        </div>
    )
}

export default App
