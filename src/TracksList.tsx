import {useQuery} from "@tanstack/react-query";
import {client} from "./shared/api/client.ts";
import {Track} from "./Track.tsx";
import {useSearchParams} from "react-router"; // API функции для работы с сервером


// const props: Props = {
//     children: <div></div>
// }

export function TracksList() {

    let [searchParams] = useSearchParams();
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
        return <div>
            sort by {searchParams.get('sort')}
            <hr/>
            Can't load tracks list</div>
    }



    return <ul>
        {data.data.map((t) => {
            return <Track
                key={t.id} // уникальный ключ для списка
             track={t} // сам объект трека
            />;
        })
        }
    </ul>;
}
