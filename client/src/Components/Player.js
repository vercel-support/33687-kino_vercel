import React, { useState, useEffect, useRef } from 'react';
import '../CSS/Player.sass';
import TopControls from './TopControls';
import BottomControls from './BottomControls';
import { toJS } from 'mobx';
import Playlist from '../Store/Playlist';
import Info from '../Store/Info';
import PlayerControls from '../Store/PlayerControls';
import PlayerOptions from '../Store/PlayerOptions';
import { observer } from 'mobx-react-lite';
import ReactPlayer from 'react-player';
import { get, set } from 'idb-keyval';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

const Player = observer(() => {

    const [volume, setVolume] = useState(1);
    const [muted, setMute] = useState(false);
    const [remaining, setDisplayRemaining] = useState(false);
    const [count, setCount] = useState(1);
    const [last, setLast] = useState(null);
    const [parsing, setParsing] = useState(true);
    const [pirate, setPirate] = useState(false);
    const [state, setState] = useState({
        playing: true,
        continueTime: true,
        settings: false,
        translations: false,
        //buffering: true,
        newurl: null,
        preload: null,
        time: 0,
        //error: false
    })

    const { playing, continueTime, settings, translations, newurl, preload, time } = state;

    const playerContainer = useRef(null);
    const playerRef = useRef(null);
    const controlsRef = useRef(null);
    const video = useFullScreenHandle();

    PlayerControls.setCurrentTime(playerRef.current ? playerRef.current.getCurrentTime() : '00:00');
    PlayerControls.setCurrentDuration(playerRef.current ? playerRef.current.getDuration() : '00:00');

    useEffect(() => {
        const BookMarks = async () => {
            var info = await get('Длительность') !== undefined ? await get('Длительность') : [];
            if (Info?.videocdn?.kinopoisk_id !== undefined && PlayerControls?.currentTime > 10) {
                var search = info?.findIndex(item => item?.kinopoisk_id === Info?.videocdn?.kinopoisk_id);
                search = (search !== -1) ? search : info.length
                if (Playlist?.translation?.id !== undefined && Playlist?.translation?.name !== undefined) {
                    info[search] = { kinopoisk_id: Info?.videocdn?.kinopoisk_id, season: Playlist?.season, episode: Playlist?.episode, currentTime: PlayerControls?.currentTime, translationId: Playlist?.translation?.id, translationName: Playlist?.translation?.name };
                    set('Длительность', info);
                } else {
                    info[search] = { kinopoisk_id: Info?.videocdn?.kinopoisk_id, season: Playlist?.season, episode: Playlist?.episode, currentTime: PlayerControls?.currentTime };
                    set('Длительность', info);
                }
            }
        }
        BookMarks();
    }, [PlayerControls?.currentTime]);

    const gettingUrl = async () => {
        PlayerOptions.setParsing(true);
        if (Info?.videocdn?.id !== undefined) {
            while (true) {
                try {
                    PlayerOptions.setBuffering(true)
                    //const url = Info?.videocdn?.content_type === 'tv_series' ? `/film?type=tv_series&id=${Info?.videocdn?.id}&season=${Playlist?.season}&episode=${Playlist?.episode}&translation=${Playlist?.translation?.id}&source=vcdn` : `/film?id=${Info?.videocdn?.id}?translation=${Playlist?.translation?.id}&source=vcdn`;
                    var url;
                    if (Playlist?.translation?.id !== null) {
                        url = Info?.videocdn?.content_type === 'tv_series' ? `/film?type=tv_series&kp=${Info?.videocdn?.kinopoisk_id}&season=${Playlist?.season}&episode=${Playlist?.episode}&translation=${Playlist?.translation?.id}&source=rezka` : `/film?kp=${Info?.videocdn?.kinopoisk_id}&translation=${Playlist?.translation?.id}&source=rezka`;
                    } else {
                        url = Info?.videocdn?.content_type === 'tv_series' ? `/film?type=tv_series&kp=${Info?.videocdn?.kinopoisk_id}&season=${Playlist?.season}&episode=${Playlist?.episode}&source=rezka` : `/film?kp=${Info?.videocdn?.kinopoisk_id}&source=rezka`;
                    }
                    const response = await fetch(url);
                    const result = await response.json();
                    Playlist.setUrl(result?.url);
                    PlayerOptions.setBuffering(false)
                    PlayerOptions.setError(false);
                    PlayerOptions.setParsing(false);
                    break;
                } catch {
                    PlayerOptions.setError(true);
                }
            }
        }
    }

    useEffect(() => {
        const Last = async () => {
            Playlist.setUrl(null);
            if (Playlist?.translation !== 'loading') {
                if (await get('Длительность') !== undefined) {
                    var info = await get('Длительность');
                    var search = info.findIndex(item => item?.kinopoisk_id === Info?.videocdn?.kinopoisk_id);
                    search !== -1 && setLast(info[search]?.currentTime);
                }
                PlayerOptions.setBuffering(true)
            }
        }
        Last();
    }, [Info?.videocdn?.kinopoisk_id, Playlist?.translation?.id]);

    var success = false;

    useEffect(() => {
        const parsingUrl = async () => {
            if (success === false && Playlist?.season !== null) {
                try {
                    //const url = Info?.videocdn?.content_type === 'tv_series' ? `/film?type=tv_series&id=${Info?.videocdn?.id}&season=${Playlist?.season}&episode=${Playlist?.episode}&translation=${Playlist?.translation?.id}&source=vcdn` : `/film?id=${Info?.videocdn?.id}?translation=${Playlist?.translation?.id}&source=vcdn`;
                    var url;
                    if (Playlist?.translation?.id !== null) {
                        url = Info?.info.serial ? `/geturl?kp=${Info?.info?.kp}&season=${Playlist?.season}&episode=${Playlist?.episode}&id=${Info.info.hdrezka_id}&translation=${Playlist?.translation?.id}&source=rezka` : `/geturl?kp=${Info?.videocdn?.kinopoisk_id}&id=${Info.info.hdrezka_id}&translation=${Playlist?.translation?.id}&source=rezka`;
                    } else {
                        url = Info?.info.serial ? `/geturl?kp=${Info?.info?.kp}&season=${Playlist?.season}&episode=${Playlist?.episode}&id=${Info.info.hdrezka_id}&source=rezka` : `/geturl?kp=${Info?.videocdn?.kinopoisk_id}&id=${Info.info.hdrezka_id}&source=rezka`;
                    }
                    const response = await fetch(url);
                    const result = await response.json();
                    Playlist.setUrl(result?.urls[0].urls[0]);
                    Playlist.setUrls(result.urls);
                    Playlist?.translation?.name === null && Playlist.setTranslation(null, result?.translations[0]?.name);
                    Playlist.setTranslations(result?.translations);
                    PlayerOptions.setError(false);
                    setParsing(false);
                    //search !== -1 && playerRef.current?.seekTo(info[search]?.currentTime);
                    PlayerControls.setPlaying(true);
                    success = true;
                    //break;
                } catch (err) {
                    PlayerOptions.setError(true)
                }
            }
        }

        parsingUrl();

    }, [Info?.videocdn?.kinopoisk_id, Playlist?.translation?.id, success])

    useEffect(() => {
        const Quality = async () => {
            PlayerOptions.setBuffering(true);
            if (await get('Длительность') !== undefined) {
                var info = await get('Длительность');
                var search = info.findIndex(item => item?.kinopoisk_id === Info?.videocdn?.kinopoisk_id);
                search !== -1 && playerRef.current?.seekTo(info[search]?.currentTime);
            }
        }
        Quality();
    }, [Playlist?.quality])

    const handleKeys = (e) => {
        if (e.code === 'Space') {
            e.preventDefault();
            PlayerControls.setPlaying(!PlayerControls?.playing)
        }

        if (e.code === 'ArrowLeft') {
            e.preventDefault();
            playerRef.current.seekTo(playerRef.current.getCurrentTime() - 5);
            handleRewind();
        }

        if (e.code === 'ArrowRight') {
            e.preventDefault();
            playerRef.current.seekTo(playerRef.current.getCurrentTime() + 5);
            handleForward();
        }

        if (e.code === 'ArrowUp') {
            e.preventDefault();
            volume.toFixed(1) <= 0.9 && setVolume(Number(volume.toFixed(1)) + 0.1) && PlayerControls.setMute(true);
            volume.toFixed(1) > 0.9 && volume.toFixed(1) < 1 && setVolume(volume.toFixed(1) + (1 - volume.toFixed(1)));
        }

        if (e.code === 'ArrowDown') {
            e.preventDefault();
            volume.toFixed(1) >= 0.1 && setVolume(volume.toFixed(1) - 0.1);
            volume.toFixed(1) > 0 && volume.toFixed(1) < 0.1 && setVolume(volume.toFixed(1) - (0.1 - volume.toFixed(1)));
        }
    }

    const handleMouseMove = () => {
        controlsRef.current.style.visibility = 'visible';
        setCount(0);
    }

    const handleRewind = () => {
        if (~['Android', 'iPhone', 'iPod', 'iPad', 'BlackBerry'].indexOf(navigator.platform)) {
            playerRef.current.seekTo(playerRef.current.getCurrentTime() - 5);
        }
    }

    const handleForward = () => {
        if (~['Android', 'iPhone', 'iPod', 'iPad', 'BlackBerry'].indexOf(navigator.platform)) {
            playerRef.current.seekTo(playerRef.current.getCurrentTime() + 5);
        }
    }

    const handleProgress = async (data) => {
        PlayerControls.setPlayed(parseFloat(data?.played));

        if (count > 3) {
            controlsRef.current.style.visibility = 'hidden';
        }

        if (controlsRef.current.style.visibility === 'visible') {
            setCount(count + 1);
        }

        if (!state.seeking) {
            setState({ ...state, ...data });
        }
    }

    useEffect(() => {
        const Preload = async () => {
            var arr;
            setState({ ...state, newurl: null });
            if (Info?.videocdn?.content_type === 'tv_series' && Info?.kp?.data?.seasons !== undefined) {
                arr = toJS(Info?.kp?.data?.seasons);
                const search = arr?.filter((res) => {
                    if (res?.number === Playlist?.season) {
                        return res
                    }
                })
                var season;
                var episode;

                if (Playlist?.episode < search[0]?.episodes.length) {
                    season = Playlist?.season;
                    episode = (Number(Playlist?.episode) + 1);
                }

                while (true) {
                    try {
                        setState({ ...state, preload: 'pending' });
                        //const url = `/film?type=tv_series&id=${Info?.videocdn?.id}&season=${season}&episode=${episode}&translation=${Playlist?.translation?.id}&source=vcdn`;
                        var url;
                        if (Playlist?.translation?.id !== null) {
                            url = Info?.videocdn?.content_type === 'tv_series' ? `/film?type=tv_series&kp=${Info?.videocdn?.kinopoisk_id}&season=${season}&episode=${episode}&translation=${Playlist?.translation?.id}&source=rezka` : `/film?kp=${Info?.videocdn?.kinopoisk_id}&translation=${Playlist?.translation?.id}&source=rezka`;
                        } else {
                            url = Info?.videocdn?.content_type === 'tv_series' ? `/film?type=tv_series&kp=${Info?.videocdn?.kinopoisk_id}&season=${season}&episode=${episode}&source=rezka` : `/film?kp=${Info?.videocdn?.kinopoisk_id}&source=rezka`;
                        }
                        const response = await fetch(url);
                        const result = await response.json();
                        setState({ ...state, newurl: result?.url });
                        break;
                    } catch (err) {
                    }
                }
            } else {
                if (Playlist?.season < arr?.length) {
                    const season = (Number(Playlist?.season) + 1);
                    const episode = (1);
                    while (true) {
                        try {
                            setState({ ...state, preload: 'pending' });
                            const url = `/film?type=tv_series&id=${Info?.videocdn?.id}&season=${season}&episode=${episode}&translation=${Playlist?.translation?.id}&source=vcdn`;
                            const response = await fetch(url);
                            const result = await response.json();
                            setState({ ...state, newurl: result?.url });
                            break;
                        } catch (err) {
                        }
                    }
                }
            }
        }

        Preload();
    }, [Playlist?.season, Playlist?.episode, Playlist?.translation?.id])

    const handleSeekChange = (e, newValue) => {
        PlayerControls.setPlayed(parseFloat(newValue / 100));
        playerRef.current.seekTo(newValue / 100);
    };

    useEffect(() => {
        if (Playlist?.last !== null) {
            playerRef.current.seekTo(Playlist?.last);
            setState({ ...state, continueTime: false, playing: true });
        }
    }, [Playlist?.last])

    const prevEpisode = () => {
        Playlist.setUrl(null);
        const arr = toJS(Playlist?.playlist?.data?.seasons);
        const search = arr?.filter((res) => {
            if (res?.number === Playlist?.season) {
                return res
            }
        })

        if (Playlist?.episode > 1) {
            Playlist.setEpisode(Playlist?.episode - 1);
            gettingUrl();
        } else {
            if (Playlist?.season > 1) {
                Playlist.setSeason(Playlist?.season - 1);
                Playlist.setEpisode(search[0]?.episodes.length);
                gettingUrl();
            }
        }
    }

    const nextEpisode = () => {
        Playlist.setUrl(null);
        const arr = toJS(Info?.kp?.data?.seasons);
        const search = arr?.filter((res) => {
            if (res?.number === Playlist?.season) {
                return res
            }
        })

        if (Playlist?.episode < search[0]?.episodes.length) {
            Playlist.setEpisode(Number(Playlist?.episode) + 1);
            gettingUrl();
        } else {
            if (Playlist?.season < arr.length) {
                Playlist.setSeason(Number(Playlist?.season) + 1);
                Playlist.setEpisode(1);
                gettingUrl();
            }
        }
    }

    const autoNext = async () => {
        const arr = toJS(Info?.kp?.data?.seasons);
        const search = arr?.filter((res) => {
            if (res?.number === Playlist?.season) {
                return res
            }
        })

        if (Playlist?.episode < search[0]?.episodes.length) {
            Playlist.setEpisode(Number(Playlist?.episode) + 1);
            gettingUrl();
        } else {
            if (Playlist?.season < arr.length) {
                Playlist.setSeason(Number(Playlist?.season) + 1);
                Playlist.setEpisode(1);
                gettingUrl();
            }
        }
    }

    useEffect(() => {
        const script = document.createElement('script');
        script.src = '//yohoho.cc/yo.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, [Info?.videocdn?.kinopoisk_id, pirate])

    useEffect(() => {
        Playlist.watch === true ? setState({ ...state, watch: true }) : setState({ ...state, watch: false });
    }, [Playlist?.watch])

    const handleVolumeChange = (e, newVolume) => {
        setVolume(parseFloat(newVolume / 100));
    }

    return (
        <section>
            {!pirate ? (<FullScreen handle={video} className='player' ref={playerContainer} tabIndex='0' onKeyDown={(e) => { handleKeys(e) }}>
                <div className='player_screen' tabIndex='0' onMouseMove={handleMouseMove} onKeyDown={(e) => { handleKeys(e) }} onClick={() => PlayerControls.setPlaying(!PlayerControls?.playing)}>
                    {PlayerOptions.buffering && (<div className='player_loading'>
                        <svg className="icon_loading" viewBox="25 25 50 50">
                            <circle className="icon_loading_front" cx="50" cy="50" r="20" fill="none" strokeWidth="5" strokeMiterlimit="10"></circle>
                            <circle className="icon_loading_back" cx="50" cy="50" r="20" fill="none" strokeWidth="5" strokeMiterlimit="10"></circle>
                        </svg>
                    </div>)}
                    {PlayerOptions.error && (<div className='player_error'>
                        <p className='error_text'>Пыня упаль, посылаем Пушистика за пакетами!</p>
                        <svg className="icon_loading" viewBox="25 25 50 50">
                            <circle className="icon_loading_front" cx="50" cy="50" r="20" fill="none" strokeWidth="5" strokeMiterlimit="10"></circle>
                            <circle className="icon_loading_back" cx="50" cy="50" r="20" fill="none" strokeWidth="5" strokeMiterlimit="10"></circle>
                        </svg>
                    </div>)}
                    <div className='left_rewind' onDoubleClick={handleRewind}></div>
                    <ReactPlayer
                        url={Playlist?.url}
                        muted={PlayerControls?.mute}
                        playing={PlayerControls?.playing}
                        width={'100%'}
                        height={'100%'}
                        style={{ margin: 'auto' }}
                        ref={playerRef}
                        volume={volume}
                        playbackRate={Playlist?.speed}
                        onProgress={handleProgress}
                        onEnded={autoNext}
                        onBuffer={() => { PlayerOptions.setBuffering(true); PlayerControls.setPlaying(true); }}
                        onBufferEnd={() => PlayerOptions.setBuffering(false)}
                    />
                    <div className='right_forward' onDoubleClick={handleForward}></div>
                </div>
                <div className='controls' ref={controlsRef}>
                    <TopControls setPirate={setPirate} />
                    <BottomControls video={video} handleSeekChange={handleSeekChange} prevEpisode={prevEpisode} nextEpisode={nextEpisode} handleVolumeChange={handleVolumeChange} />
                </div>
            </FullScreen>) :
                (<div key={Info?.videocdn?.kinopoisk_id}>
                    <div id="yohoho" className='player' data-kinopoisk={Info?.videocdn?.kinopoisk_id} data-resize="1" data-season={Playlist?.season} data-episode={Playlist?.episode}></div>
                    <button className='inside_player' onClick={() => setPirate(false)}>Перейти в дядькин плеер</button>
                </div>)
            }
        </section >
    )
}
)

export default Player
