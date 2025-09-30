import {useQuery} from "@tanstack/react-query";
import {client} from "./shared/api/client.ts";
import {Track} from "./Track.tsx"; // API функции для работы с сервером

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
    const {data,  isPending,isError} = useQuery({
        queryFn: async () => { // функция для запроса всех треков
            const clientData = await client.GET('/playlists/tracks')
            return clientData.data!
        },
        queryKey: ['tracks', 'list']
    })


    // если статус loading — показываем лоадер
    if (isPending) {
        return <div>loading...</div>
    }

    if (isError) {
        return <div>Can't load tracks list</div>
    }

    // вызывается при клике на трек — уведомляем родителя
    const handleSelect = (trackId: string) => {
        // setSelectedTrackId(trackId) // тут мы могли бы сами держать selectedTrackId
        props.onTrackSelect(trackId) // уведомляем родителя, что такой трек выбран
    }

    return <ul>
        {data.data.map((t) => {
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
