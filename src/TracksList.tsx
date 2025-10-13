import {useQuery} from "@tanstack/react-query";
import {client} from "./shared/api/client.ts";
import {Track} from "./Track.tsx";
import {useSearchParams} from "react-router";
import {useRef, useState} from "react"; // API функции для работы с сервером

// const props: Props = {
//     children: <div></div>
// }

export function TracksList() {

    let [searchParams] = useSearchParams();

    const [currentTrack, setCurrentTrack] = useState<string | null>(null); // хранит ID сейчас играющего трека.
    const audioElementRef = useRef<Record<string, HTMLAudioElement | null>>({}); // это объект, где ключ = ID трека, а значение = сам <audio> элемент.
    // делаем запрос к API через useQuery
    // загрузка.FSM типо true\false, но мы предполагаем, что будут дополнительные детали
    const {data, isPending, isError} = useQuery({
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
    const handelTrackEnded = (id: string) => {
        const endedIndex = data.data.findIndex((e) => e.id === id);
        if (endedIndex !== -1) {
            const nextTrack = data.data[endedIndex + 1];
            setCurrentTrack(nextTrack!.id); // обновляем состояние
            audioElementRef.current[nextTrack!.id]!.play() // запускаем следующий трек через ссылку на DOM-элемент
        }
    }
    const handelTrackPlay = (id: string) => {
        setCurrentTrack(id)
    }

    return <ul>
        {data.data.map((t) => {
            return <Track
                key={t.id} // уникальный ключ для списка
                track={t} // сам объект трека
                onTrackEnded={handelTrackEnded} // после того как трек проигрался до конца вызывается метод
                isSelected={currentTrack === t.id} // каждому треку передаем true или false, если трек у трек листа совпадет с тем треком, который мы рисуем тогда мы передаем true треку
                onTrackPlay={handelTrackPlay}
                setRef={(el)=>{ // сюдо дочерний элемент трек засунет элемент
                    audioElementRef.current[t.id] = el //он берет пиходящий эл и вкладывает себе в реф
                }}
            />;
        })
        }
    </ul>;
}
