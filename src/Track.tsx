import type {SchemaTrackListItemOutput} from "./shared/api/schema.ts";
import {NavLink} from "./shared/libs/route/Route.tsx";


type Props = {
    track: SchemaTrackListItemOutput
    onTrackEnded: (id: string) => void;
    isSelected: boolean;
    onTrackPlay: (id: string) => void;
    setRef: (el: HTMLAudioElement | null) => void;
}

export function Track(props: Props) {

    // const audioRef = useRef<any>(null);

    const handelTrackEnded = () => {
        props.onTrackEnded(props.track.id); // сообщает родительскому компоненту (TracksList), что треκ с таким id закончился.
    }
    // const handelPlayClick = () => {
    //     props.onTrackPlay(props.track.id);
    //     // audioRef.current.play(); // что бы элемент начал играть
    // }

    return (
        <li>

            <h4>
                <NavLink to={'/tracks/' + props.track.id}>
                    {props.track.attributes.title}
                </NavLink>
            </h4>
            <audio
                // autoPlay={props.isAutoPlay}
                src={props.track.attributes.attachments[0]!.url}
                controls={true}
                onEnded={handelTrackEnded} // при окончании трека
                ref={(el) => {
                    // audioRef.current = el // привязываем к рефу
                    props.setRef(el) // плеер «передаётся наверх» — родитель сохраняет ссылку на DOM-элемент <audio> для последующего управления (например, чтобы вызвать .play() программно)
                }}
            />
            {/*<button onClick={handelPlayClick}>Play           </button>*/}
        </li>)
}