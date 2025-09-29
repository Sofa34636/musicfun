import type {TrackResponse} from "./types.ts";
import {api} from "./api.ts";
import {useQuery} from "./hooks/utils/useQuery.ts";

type Props = {
    trackId: string | null // id выбранного трека
}


function useTrackDetail(trackId: string | null) {
    const {
        status: detailQueryStatus, // загрузка деталей
        data: track // данные выбранного трека
    } = useQuery<TrackResponse>({
        queryStatusDefault: 'pending', // начальный статус
        queryKeys: [trackId!], // зависимость будет вызываться при каждом новом треке
        skip: !trackId, // если trackId нет — пропускаем запрос
        queryFn: () => {
            return api.getTrack(trackId!) // помещаем данные выбранного трека
        }
    })


    return {
        detailQueryStatus,
        track
    }
}


export function TrackDetail(props: Props) {
    const {detailQueryStatus, track} = useTrackDetail(props.trackId);

    if (detailQueryStatus === 'pending') { // если нам ничего не пришло чистим стейт
        return <span>no track for display</span>
    }

    if (detailQueryStatus === 'loading') { // убираем надпись загрузки, 'success' - запрос пришел
        return <div>loading...</div>
    }

    return <div>
        <h2>Detail</h2>

        <h3>{track!.data.attributes.title}</h3>
        <div>{track!.data.attributes.addedAt}</div>
        <div>likes: {track!.data.attributes.likesCount}</div>
        <div>lyrics: {track!.data.attributes.lyrics}</div>

    </div>;
}
