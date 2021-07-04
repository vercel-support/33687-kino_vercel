import React, { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import style from '../CSS/Filminfo.module.sass';
import Skeleton from "react-loading-skeleton";
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import PlayerOptions from '../Store/PlayerOptions';
import { set, get } from 'idb-keyval';
import Playlist from '../Store/Playlist';
import Info from '../Store/Info';
import Layout from '../Store/Layout';
import YouTube from 'react-youtube';
import { Img } from 'react-image';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import Player from './Player';


const FilmInfo = observer((props) => {

    const [youtube, setYoutube] = useState(null);
    //const [info, setInfo] = useState(null);
    //const [meta, setMeta] = useState(null);
    const [add, setAdd] = useState(false);
    const film = props.film;
    const herofilm = useRef(null)
    const [width, setWidth] = useState(null);

    const handleWatch = () => {
        PlayerOptions.setWatch(true);
        Layout.setTrailer(false);
        Layout.setPoster(false);
        window.scrollTo(0, 0)
    }

    useEffect(() => {
        PlayerOptions.setWatch(false);
        Info.videoCDN(null);
        Info.setInfo(null);
        Info.setDetails(null);
        Playlist.setUrl(null);
        const Favorite = async () => {
            var arr = await get('Избранное');
            if (arr?.find(item => item.id === film) === undefined) {
                setAdd(false)
            } else {
                setAdd(true)
            }
        }
        Favorite();

        const easyWatch = async () => {
            var arr = await get('Длительность');
            var search = arr?.findIndex(item => item?.kinopoisk_id === film);
            try {
                if (arr[search]?.translationId !== undefined) {
                    Playlist.setTranslation(arr[search]?.translationId, arr[search]?.translationName);
                } else {
                    Playlist.setTranslation(null, null);
                }
            }

            catch (err) {
                Playlist.setTranslation(null, null);
            }
        }

        easyWatch();

    }, [film])

    useEffect(() => {
        const Youtube = async () => {
            if (Info?.info?.trailer !== undefined) {
                Layout.setPoster(true);
                //setYoutube(Info?.info?.trailer.substr(32))
            }
        }
        Youtube();
    }, [Info?.info?.trailer])

    useEffect(() => {
        const Fetch = async () => {
            window.scrollTo(0, 0);
            if (toJS(Info?.info?.kp) !== undefined) {
                const response = await fetch(`https://videocdn.tv/api/${toJS(Info?.info?.serial) && 'tv-series'}?kinopoisk_id=${Info?.info?.kp}&api_token=hN5DM7MixFeDKcu9KiwLrGBBlFKbwOHp`);
                const result = await response.json();
                Info.videoCDN(result?.data[0]);
                PlayerOptions.setId(result?.data[0]?.id);
            }
        }
        Fetch();
    }, [Info?.info?.kp])

    useEffect(() => {
        const Details = async () => {
            const response = await fetch(`/details?id=${film}`);
            const result = await response.json();
            Info.setDetails(result.details);
        }
        Details();
    }, [film])

    const Fav = async () => {
        var arr = await get('Избранное');

        if (arr?.find(item => item.id === film) === undefined) {
            if (arr === undefined) {
                arr = [];
                arr.push({ name: Info?.info?.title, poster: Info?.details?.poster, id: film });
                set('Избранное', arr);
                setAdd(true)
            } else {
                if (arr?.find(item => item.id === film) === undefined) {
                    arr.push({ name: Info?.info?.title, poster: Info?.details?.poster, id: film });
                    set('Избранное', arr);
                    setAdd(true)
                }
            }
        } else {
            arr?.reduce((resarr, res, index) => {
                if (res.id === film) {
                    arr.splice(index, 1)
                }
            }, [])
            set('Избранное', arr);
            setAdd(false)
        }
    }

    const opts = {
        playerVars: {
            autoplay: 1,
            playsinline: 1,
            mute: 1,
            loop: 1,
            start: 6,
            end: 6,
            playlist: youtube,
            controls: 0,
            disablekb: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            autohide: 1
        },
    };

    const onReady = (event) => {
        event.target.mute();
        event.target.playVideo();
    }

    const expand = PlayerOptions?.watch ? true : false

    return (
        <section className={style.film_hero}>
            <Helmet>
                <title>{`${Info?.info?.title} — смотреть у Дядьки онлайн без регистрации и СМС`}</title>
            </Helmet>
            <div className={`${style.screen} ${expand ? style.expand : ''}`}>
                {(Layout?.trailer || Layout?.poster) && (<div className={style.preview}>
                    {Layout?.trailer && youtube !== null && (<YouTube videoId={youtube} opts={opts} onReady={onReady} />)}
                    {Layout?.poster && (
                        <div className={style.hero_poster} ref={node => setWidth(node?.offsetWidth)}>
                            {Info?.info?.kp !== undefined && (<picture className={style.hero_picture} key={Info?.info?.kp}>
                                <source media="(max-width: 767px)" srcSet={`https://cdn.statically.io/img/blackmedia.top/f=auto,w=${width},q=100/media/${Info?.info?.kp}/big_app_cinema_media_${Info?.info?.kp}_big.jpg`} />
                                <source media="(min-width: 767px)" srcSet={`https://cdn.statically.io/img/blackmedia.top/f=auto,w=${width},q=100/media/${Info?.info?.kp}/wide_app_cinema_media_${Info?.info?.kp}.jpg`} />
                                <Img
                                    src={`https://cdn.statically.io/img/blackmedia.top/f=auto,q=100/media/${Info?.info?.kp}/wide_app_cinema_media_${Info?.info?.kp}.jpg`}
                                    className={style.hero_poster_img}
                                    loader={<Skeleton count={1} duration={2} width={'100%'} height={'50vw'} />}
                                    unloader={<div className={style.error_hero} />}
                                />
                            </picture>)}
                        </div>
                    )}
                </div>)}
                {PlayerOptions?.watch && (<div key={film} className={style.film_player}>
                    <Player />
                </div>)}
            </div>
            <div className={style.film_content}>
                {!PlayerOptions.watch && (<button className={style.film_info_watch} onClick={handleWatch}><PlayArrowIcon /> &nbsp;смотреть</button>)}
                {Info?.info?.title ? <h1 className={style.film_title}>{Info?.info?.title} смотреть онлайн</h1> :
                    <><Skeleton className={style.film_title_loader} count={1} duration={2} />
                        <Skeleton className={style.film_subtitle_loader} count={1} duration={2} width={'70%'} /></>}
                <div>{Info?.info?.etitle !== undefined ? <p className={style.film_eng_title}>{Info?.info?.etitle}</p> : <Skeleton className={style.film_eng_title_loader} count={1} duration={2} />}</div>
                <div>
                    {Info?.info?.year ?
                        <div className={style.film_info}>{(<p>{Info?.info?.year && (<>{Info?.info?.year.slice(0, 4)} • </>)}
                            {/*Info?.kp?.data?.premiereWorldCountry !== null && (<>{Info?.kp?.data?.premiereWorldCountry} • </>)*/}
                            {Info?.info?.genre !== undefined && (<>{Info?.info?.genre} • </>)}
                            {Info?.info?.country !== undefined && (<>{Info?.info?.country} • </>)}
                            {Info?.info?.ageLimits !== undefined && (<>{Info?.info?.ageLimits}+</>)}
                        </p>)}</div>
                        : <Skeleton className={style.film_info_loader} count={1} duration={2} />}
                </div>
                <div className={style.rating_block}>
                    <div className={style.rating_item}>
                        {Info?.details?.ratingKinopoisk !== undefined ? <p className={style.rating_value}>{Info?.details?.ratingKinopoisk}</p> : <Skeleton className={style.rating_value_loader} count={1} duration={2} />}
                        {Info?.details?.ratingKinopoisk !== undefined ? <p className={style.rating_name}>КиноПоиск</p> : <Skeleton className={style.rating_name_loader} count={1} duration={2} />}
                    </div>
                    <div className={style.rating_item}>
                        {Info?.details?.ratingImdb !== undefined ? <p className={style.rating_value}>{Info?.details?.ratingImdb}</p> : <Skeleton className={style.rating_value_loader} count={1} duration={2} />}
                        {Info?.details?.ratingImdb !== undefined ? <p className={style.rating_name}>IMDb</p> : <Skeleton className={style.rating_name_loader} count={1} duration={2} />}
                    </div>
                </div>
                <div className={style.buttons_block}>
                    {!add && (<button onClick={() => { Fav(); }} className={style.film_info_button}><FavoriteBorderIcon /></button>)}
                    {add && (<button onClick={() => { Fav(); }} className={style.film_info_button}><FavoriteIcon /></button>)}
                    <CopyToClipboard text={`${document.domain}/film/${film}`}>
                        <button className={style.film_info_button}><ShareIcon /></button>
                    </CopyToClipboard>
                    <a href="https://my-files.su/Save/jmodpm/debug.json"><button className={style.film_info_button}><CloudDownloadIcon /></button></a>
                </div>
            </div>
        </section >
    )
}
)

export default FilmInfo
