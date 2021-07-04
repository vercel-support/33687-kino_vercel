import React, { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import Info from '../Store/Info';
import Playlist from '../Store/Playlist';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import { get, set } from 'idb-keyval';
import PlayerControls from '../Store/PlayerControls';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import style from '../CSS/TopControls.module.sass'

const TopControls = observer(({ setPirate }) => {
    const [translations, setTranslations] = useState(null);
    const [continueTime, setContinueTime] = useState(false);
    //const [pirate, setPirate] = useState(false);
    const modalContainer = useRef(null);
    const translateModal = useRef(null);

    useEffect(() => {
        const onClick = e => translateModal.current?.contains(e.target) || setTranslations(false);
        document.addEventListener("click", onClick);
        return () => document.removeEventListener("click", onClick);
    }, []);

    useEffect(() => {
        const BookMarks = async () => {
            if (Info?.videocdn?.kinopoisk_id !== undefined && await get('Длительность') !== undefined) {
                const info = await get('Длительность');
                const search = info?.findIndex(item => item?.kinopoisk_id === Info?.videocdn?.kinopoisk_id);
                search !== -1 && info[search]?.season === Playlist?.season && info[search]?.episode === Playlist?.episode && info[search]?.currentTime !== undefined && setContinueTime(true);
            }
        }
        BookMarks();
    }, []);

    const handleContinue = async () => {
        const info = await get('Длительность');
        const search = info?.findIndex(item => item?.kinopoisk_id === Info?.videocdn?.kinopoisk_id);
        const time = info[search]?.currentTime;
        Playlist.setLast(time);
        setContinueTime(false);
    }

    const handleTranslation = async (id, name) => {
        setTranslations(!translations);
        Playlist.setTranslation(id, name);
        var info = await get('Длительность') !== undefined ? await get('Длительность') : [];
        if (Info?.videocdn?.kinopoisk_id !== undefined) {
            var search = info?.findIndex(item => item?.kinopoisk_id === Info?.videocdn?.kinopoisk_id);
            search = (search !== -1) ? search : info.length
            info[search] = { kinopoisk_id: Info?.videocdn?.kinopoisk_id, season: Playlist?.season, episode: Playlist?.episode, currentTime: PlayerControls?.currentTime, translationId: id, translationName: name };
            set('Длительность', info);
        }
    }

    useEffect(() => {
        if (Playlist?.translations !== null) {
            Playlist.setTranslation(null, Playlist?.translations[0]?.name)
        }
    }, [Playlist?.translations])

    return (
        <div className={style.top_controls}>
            <div className={style.top_left}>
                {Info?.info?.serial && (<p className={style.episode_info}>{Info?.info?.title}. Сезон {Playlist?.season}. Серия {Playlist?.episode}</p>)}
                {!Info?.info?.serial && (<p className={style.episode_info}>{Info?.info?.title}</p>)}
                {continueTime !== false /* && !parsing*/ && (<button onClick={handleContinue} className={style.button_continue}>Продолжить</button>)}
            </div>
            <div className={style.top_right} key={translations}>
                <div className={style.translation_preview} onClick={(e) => { e.stopPropagation(); Playlist?.translations?.length > 1 && setTranslations(!translations) }}>{Playlist?.translation?.name} {Playlist?.translations?.length > 1 && (translations ? <ExpandLessIcon /> : <ExpandMoreIcon />)}</div>
                {translations && Playlist?.translations?.length > 1 && (<div className={style.translations_list} ref={translateModal}>
                    {Playlist?.translations?.map((res, key) => (
                        <span className={style.translation_item} onClick={() => handleTranslation(res?.id, res?.name)} key={key}>{res?.name}</span>
                    ))}
                </div>)}
                <button className={style.button_pirate} onClick={() => { setPirate(true) }}> Внешний плеер</button>
            </div>
        </div>
    )
}
)

export default TopControls