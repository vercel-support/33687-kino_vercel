import React, { useState, useEffect, useRef } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import style from '../CSS/Similar.module.sass';
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import ScrollContainer from 'react-indiana-drag-scroll';
import { BrowserRouter as Router, Link } from "react-router-dom";
import Playlist from '../Store/Playlist';
import PlayerOptions from '../Store/PlayerOptions';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import "swiper/swiper.min.css";
import '../CSS/Slider.sass';
import SwiperCore, { Navigation } from "swiper/core";
import Info from '../Store/Info';
import { observer } from 'mobx-react-lite';

SwiperCore.use([Navigation]);

const breakpointsSimilar = { 320: { slidesPerView: 3.5 }, 768: { slidesPerView: 7 } }

const navigationSimilar = {
    nextEl: '.swiper-button-next.similar',
    prevEl: '.swiper-button-prev.similar',
}

const Similar = observer((data) => {
    const [similar, setSimilar] = useState(null);
    const [width, setWidth] = useState(null);

    useEffect(() => {
        if (Info?.videocdn?.kinopoisk_id !== undefined) {
            const Fetch = async () => {
                const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${Info?.videocdn?.kinopoisk_id}/similars`, {
                    headers: {
                        "X-API-KEY": "ceff3505-c77c-450a-8abb-aa29f638f5ee"
                    }
                });
                const result = await response.json();
                setSimilar(result?.items);
            }
            Fetch();
        }
    }, [Info?.videocdn?.kinopoisk_id])

    return (
        <SkeletonTheme color="#202020" highlightColor="#444">
            <section>
                {similar?.length > 0 && (<div className={style.similar_container} key={Playlist?.cdn?.kinopoisk_id}>
                    <h3 className={style.section_title}>Похожие фильмы и сериалы</h3>
                    {/*<ScrollContainer className='similar_feed' horizontal='true' vertical='false' hideScrollbars='true'>*/}
                    <Swiper
                        slidesPerView={7}
                        freeMode={true}
                        navigation={navigationSimilar}
                        key={Playlist?.cdn?.kinopoisk_id}
                        breakpoints={breakpointsSimilar}
                        centeredSlidesBounds={true}
                        centeredSlides={true}
                        className={style.similar_feed}
                    >
                        <div className='swiper-button-prev similar'></div>
                        <div className='swiper-button-next similar'></div>

                        {similar?.map((res, key) => (
                            <SwiperSlide className={style.similar_item} key={key} onClick={() => PlayerOptions.setWatch(false)}>
                                <Link ref={node => setWidth(node?.offsetWidth)} to={`/${Info?.videocdn?.content_type === 'tv_series' ? "tv-series" : "movies"}/${res?.filmId}`}>
                                    <LazyLoadImage
                                        src={`https://cdn.statically.io/img/${res?.posterUrlPreview.slice(8, 35)}/f=auto,w=${width},q=100/${res?.posterUrlPreview.slice(36)}`}
                                        alt={res?.nameRu}
                                        className={style.similar_poster}
                                        effect="blur"
                                    />
                                    {res?.nameRu !== undefined ? <p className={style.similar_name}>{res?.nameRu}</p> : <Skeleton count={1} duration={2} width={'10vw'} height={'2vw'} style={{ marginTop: '1vw' }} />}
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>)}
            </section>
        </SkeletonTheme >
    )
}
)

export default Similar