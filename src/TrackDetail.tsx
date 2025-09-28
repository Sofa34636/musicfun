import {useEffect, useRef, useState} from "react";
import type {TrackResponse} from "./types.ts";
import {api} from "./api.ts";

type Props = {
    trackId: string | null
}


export function TrackDetail(props: Props) {
    const [detailQueryStart, setDetailQueryStart] = useState<'pending' | 'success' | 'loading'>('pending') // загрузка деталей
    const [track, setTrack] = useState<TrackResponse | null>(null) // id выбранного трека

    const abortControllerRef = useRef<null | AbortController>(null) // создаём контроллер для возможности отмены запроса. Экономия ресурса и мы не  дожидаетмся  окончания запроса, когда он  уже не нужен

    useEffect(() => {
        abortControllerRef.current?.abort() // обрываем связь, если ...

        if (!props.trackId) {
            setTrack(null) // если нам ничего не пришло чистим стейт
            setDetailQueryStart('pending')
            return;
        }
        abortControllerRef.current = new AbortController() //
        setDetailQueryStart('loading');
        api.getTrack(props.trackId, abortControllerRef.current.signal)
            .then(json => {
                setTrack(json); // помещаем данные выбранного трека
                setDetailQueryStart('success'); // убираем надпись загрузки,  'success' - запрос  пришел
            })
    }, [props.trackId]); // зависимость будет вызываться при каждом   новом треке
    if (detailQueryStart === 'pending') {
        return <span>no track for display</span>
    }

    if (detailQueryStart === 'loading') {
        return <div>loading...</div>
    }

    return (
        <div>
            <h2>Detail</h2>
            <h3>{track?.data.attributes.title}</h3>
            <div>{track?.data.attributes.likesCount}</div>
            <div>{track?.data.attributes.lyrics}</div>


        </div>
    )
}