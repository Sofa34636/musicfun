
import {api} from "./api.ts";
import {useQuery} from "./hooks/utils/useQuary.ts"; // API функции для работы с сервером

type Props = {
    trackId: string | null // id выбранного трека (или null, если ничего не выбрано)
}

export function TrackDetail(props: Props) {
    console.log('TrackDetail') // просто смотрим в консоли, что компонент рендерится

    // достаём из хука данные и статус
    const {data, status} = useQuery({
        queryFn: ({signal}) => { // функция, которая будет делать запрос
            return api.getTrack(props.trackId!, signal); // получаем конкретный трек
        },
        enabled: Boolean(props.trackId), // если trackId нет, запрос не делаем
        queryKey: ['track', props.trackId] // ключ для кэша и подписки
    })

    // если статус pending (ничего не выбрано или очистили)
    if (status === 'pending') {
        return <span>no track for display</span> // показываем надпись
    }

    // если статус loading — показываем лоадер
    if (status === 'loading') {
        return <div>loading...</div>
    }

    // если статус success — рендерим детали трека
    return  <div>
        <h2>Detail</h2>

        <h3>{data!.data.attributes.title}</h3> {/* название трека */}
        <div>{data!.data.attributes.addedAt}</div> {/* когда добавлен */}
        <div>likes: {data!.data.attributes.likesCount}</div> {/* количество лайков */}
        <div>lyrics: {data!.data.attributes.lyrics}</div> {/* текст песни */}
    </div>
}
