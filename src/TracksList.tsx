import {Track} from "./Track.tsx";
import {useEffect, useState} from "react";
import type {TrackDataItem,} from "./types.ts";
import {api} from "./api.ts";

type Props = {
    onTrackSelected: (trackId: string) => void;
    selectedTrackId: string  | null;
}

export function TracksList(props: Props) {
    const [listQueryStatus, setQueryListStatus] = useState<'pending' | 'success' | 'loading'>('loading') // загрузка.FSM типо true\false,  но мы предпологаем, что будут дополнительные детали
    const [tracks, setTracks] = useState<TrackDataItem[] | null>(null) // треки
    // const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null) // трек, который выбран


    useEffect(() => {  // Хук выполняется после первой отрисовки компонента.
        // Если передать пустой массив зависимостей [], эффект сработает только один раз (аналог componentDidMount).
        // Здесь выполняем запрос к API после монтирования компонента.

        api.getTracks() //   сделали  запрос
            .then(json => {
                setTracks(json.data); // помещаем все данные в tracks
                setQueryListStatus('success') // убираем надпись загрузки
            })

    }, [])

    if (listQueryStatus === 'loading') {
        return <div>loading...</div>
    }

    const handleSelect = (trackId: string) => {
        // setSelectedTrackId(trackId)
        props.onTrackSelected(trackId)  //  уведомляем  родителя, что такой трек  выбран
    }

    return <ul>
        {tracks?.map(t => {
                return (<Track
                    onSelect={handleSelect} // когда вызовишь функцию передай мне  trackId
                    isSelected={t.id === props.selectedTrackId} // если id === id нажатого элемента, то меняем цвет
                    track={t}
                />)
            }
        )}

    </ul>
}