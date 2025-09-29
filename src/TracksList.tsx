import {Track} from "./Track.tsx";
import * as React from "react";
import type {TrackDataItem} from "./types.ts";
import {api} from "./api.ts";
import {useQuery} from "./hooks/utils/useQuery.ts";

type Props = {
    onTrackSelect: (trackId: string) => void //  уведомляем  родителя, что такой трек  выбран
    selectedTrackId: string | null // трек, который выбран
}

function useTracksList(onTrackSelect: (trackId: string) => void) {
    const {
        status: listQueryStatus, // загрузка.FSM типо true\false,  но мы предпологаем, что будут дополнительные детали
        data: tracks, // треки
    } = useQuery<TrackDataItem[]>({
        queryKeys: [], // ключи запроса
        queryFn: () => {
            return api.getTracks() //   сделали  запрос
                .then(json => json.data) // помещаем все данные в tracks
        }
    }) // FSM

    React.useEffect(() => {  // Хук выполняется после первой отрисовки компонента.
        // Если передать пустой массив зависимостей [], эффект сработает только один раз (аналог componentDidMount).
        // Здесь выполняем запрос к API после монтирования компонента.
    }, [])

    const handleSelect = (trackId: string) => {
        // setSelectedTrackId(trackId)
        onTrackSelect(trackId)  //  уведомляем  родителя, что такой трек  выбран
    }

    return {
        handleSelect,
        listQueryStatus,
        tracks
    }
}

// GRASP: high cohesion / low coupling
export function TracksList(props: Props) {
    const {
        handleSelect,
        listQueryStatus,
        tracks
    } = useTracksList(props.onTrackSelect);

    if (listQueryStatus === 'loading') {
        return <div>loading...</div> // убираем надпись загрузки
    }

    return <ul>
        {tracks?.map(t => {
            return <Track
                onSelect={handleSelect} // когда вызовишь функцию передай мне  trackId
                isSelected={t.id === props.selectedTrackId} // если id === id нажатого элемента, то меняем цвет
                track={t} // сам объект трека
            />;
        })
        }
    </ul>;
}
