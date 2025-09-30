

import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {client} from "./shared/api/client.ts";
import {useParams} from "./shared/libs/router/Route.tsx";


export function TrackDetail() {
    console.log('TrackDetail') // просто смотрим в консоли, что компонент рендерится

    const {trackId} = useParams();

    // достаём из хука данные и статус
    const {data, isPending, isError, isFetching} = useQuery({
        queryFn: async ({signal}) => { // функция, которая будет делать запрос
            const clientData = await  client.GET('/playlists/tracks/{trackId}', { // получаем конкретный трек
                params: {
                    path: {
                        trackId: trackId!
                    }
                },
                signal: signal
            });
            return clientData.data!
        },
        enabled: Boolean(trackId), // если trackId нет, запрос не делаем
        queryKey: ['track' , 'detail', trackId], // ключ для кэша и подписки
        placeholderData: keepPreviousData // сохрани предыдущие данные,
    })



    if (!trackId) { // если трек не выбран
        return <div>no track selected</div>
    }

    if (isPending) { //
        return <div>fetching...</div>
    }

    if (isError) {return <span>some error when fetch track</span>}


    // если статус success — рендерим детали трека
    return  <div>
        <h2>Detail {isFetching && '⏳'}</h2>

        <h3>{data.data.attributes.title}</h3> {/* название трека */}
        <div>{data.data.attributes.addedAt}</div> {/* когда добавлен */}
        <div>likes: {data.data.attributes.likesCount}</div> {/* количество лайков */}
        <div>lyrics: {data.data.attributes.lyrics}</div> {/* текст песни */}
    </div>
}
