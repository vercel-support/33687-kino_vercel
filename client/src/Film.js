import React, { useEffect, useState } from 'react';
import { SkeletonTheme } from "react-loading-skeleton";
import { useParams } from "react-router-dom";
import Staff from './Components/Staff';
import Episodes from './Components/Episodes';
import FilmInfo from './Components/FilmInfo';
import Similar from './Components/Similar';
import Info from './Store/Info';
import style from './CSS/Film.module.sass';

const Film = () => {
    const { film } = useParams();
    const [series, setSeries] = useState(false);

    useEffect(() => {
        const Fetch = async () => {
            const response = await fetch(`/film?id=${film}`);
            const result = await response.json();
            Info.setInfo(result.film);
            result.film.serial && setSeries(true);
        }
        Fetch();
    }, [film])

    return (
        <SkeletonTheme color="#202020" highlightColor="#444">
            <FilmInfo film={film} />
            <div className={style.film_container}>
                {series && <Episodes />}
                {<Staff id={film} />}
                {<Similar id={film} />}
            </div>
        </SkeletonTheme>

    )
}


export default Film
