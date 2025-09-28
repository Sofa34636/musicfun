import type {TrackDataItem} from "./types.ts";

type Props = {
    track: TrackDataItem
    isSelected:  boolean
    onSelect: (trackId: string) => void  // кол бэк функкцию  передали, которая ничего не отдает,но принимает
}

export function Track(props: Props) {



    const color =  props.isSelected ? "green" : "white";

    return (
        <li  style={{color: color}}>
            <h4 onClick={() => {
                props.onSelect(props.track.id)
            }} // () => {} - кол бэк функция наблюдатель, слушатель события, который вызывается при клике
            >
                {props.track.attributes.title}</h4>
            <audio src={props.track.attributes.attachments[0]?.url}
                   controls={true}
            />
        </li>)
}