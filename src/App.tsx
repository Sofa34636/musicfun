import {TracksList} from "./TracksList.tsx";
import {TrackDetail} from "./TrackDetail.tsx";
import {useState} from "react";

export const App = () => {
    const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);

    return (
        <div>

            <button onClick={() => setSelectedTrackId(selectedTrackId)}></button>
            <div style={{display: 'flex', gap: '20px'}}>
                <TracksList
                    selectedTrackId={selectedTrackId}
                    onTrackSelected={(trackId) => {
                        setSelectedTrackId(trackId); // нам приходит выбранный трек, мы  делаем перерисовку
                    }}/>

                <TrackDetail trackId={selectedTrackId}  //  передали  выбранный трек
                />
            </div>
        </div>)
}