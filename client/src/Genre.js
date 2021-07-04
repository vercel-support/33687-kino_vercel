import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { BrowserRouter as Router, Link } from "react-router-dom";
import style from "./CSS/Genre.module.sass";
import Navigation from "./Components/Navigation";

const Genre = () => {
    const { genre, number } = useParams();
    const [result, setResult] = useState(null);
    const [category, setCategory] = useState(null);

    useEffect(() => {
        const Fetch = async () => {
            const title = genre[0].toUpperCase() + genre.slice(1)
            setCategory(title);
            const idresponse = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.1/films/filters`, {
                headers: {
                    "X-API-KEY": "ceff3505-c77c-450a-8abb-aa29f638f5ee"
                }
            });
            const idresult = await idresponse.json();
            const id = idresult?.genres.filter((res) => {
                if (res.genre === genre) {
                    return res
                }
            })[0].id
            const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-filters?genre=${id}&page=${number}`, {
                headers: {
                    "X-API-KEY": "ceff3505-c77c-450a-8abb-aa29f638f5ee"
                }
            });
            const result = await response.json();

            setResult(result)
        }
        Fetch();
    }, [genre, number])

    return (
        <div>
            <h1 className={style.genre_title}>{category}</h1>
            {(number > result?.pagesCount) && (<h1 className={style.genre_title}>Результатов поиска оказалось немного меньше :(</h1>)}
            <div className={style.genre_section}>
                {result?.films?.map((res, key) => (
                    <div className={style.genre_item} key={key}>
                        <Link to={`/${res?.nameRu?.includes("сериал") ? "tv-series" : "movies"}/${res?.filmId}`}>
                            <img className={style.genre_poster} alt={res?.nameRu} src={`${res?.posterUrl}`}></img>
                            <div className={style.item_title}>
                                <p>{res?.nameRu}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            <Navigation number={result?.pagesCount} />
        </div >
    )
}

export default Genre
