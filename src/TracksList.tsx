import {Track} from "./Track.tsx"; // компонент отдельного трека
import {api} from "./api.ts";
import {useQuery} from "./hooks/utils/useQuary.ts";
import type {TrackDataItem} from "./types.ts"; // API функции для работы с сервером

type Props = {
    onTrackSelect: (trackId: string) => void // функция для уведомления родителя, что выбран трек
    selectedTrackId: string | null, // id выбранного трека
    // children: ReactElement // (закомментированный пример как можно было бы передавать children)
}

// const props: Props = {
//     children: <div></div>
// }

export function TracksList(props: Props) {

    // делаем запрос к API через useQuery
    // загрузка.FSM типо true\false, но мы предполагаем, что будут дополнительные детали
    const {data, status} = useQuery({
        queryFn: () => api.getTracks(), // функция для запроса всех треков
        queryKey: ['tracks'] // ключ для кэша
    })

    // если статус loading — показываем лоадер
    if (status === 'loading') {
        return <div>loading...</div>
    }

    // вызывается при клике на трек — уведомляем родителя
    const handleSelect = (trackId: string) => {
        // setSelectedTrackId(trackId) // тут мы могли бы сами держать selectedTrackId
        props.onTrackSelect(trackId) // уведомляем родителя, что такой трек выбран
    }

    return <ul>
        {data?.data.map((t: TrackDataItem) => {
            return <Track
                key={t.id} // уникальный ключ для списка
                onSelect={ handleSelect } // когда вызовешь функцию — передай мне trackId
                isSelected={t.id === props.selectedTrackId} // если id === id нажатого элемента, то меняем цвет
                track={t} // сам объект трека
            />;
        })
        }
    </ul>;
}
