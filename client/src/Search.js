import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import style from "./CSS/Search.module.sass";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Navigation from "./Components/Navigation";

const Search = () => {
    const { search, number } = useParams();
    const [result, setResult] = useState(null);

    useEffect(() => {
        const Fetch = async () => {
            const response = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${search}&page=${number}`, {
                headers: {
                    "X-API-KEY": "ceff3505-c77c-450a-8abb-aa29f638f5ee"
                }
            });
            const result = await response.json();
            setResult(result)
        }
        Fetch();
    }, [search, number])
    return (
        <div>
            {search !== 'null' && search !== ' ' && (<h1 className={style.search_title}>Результаты поиска по запросу: "{search}"</h1>)}
            {(search === 'null' || search === ' ')  && (<h1 className={style.search_title}>Пустой поисковый запрос</h1>)}
            {(search !== 'null' && search !== ' ' && (Number(number) > Number(result?.pagesCount))) && (<h1 className={style.genre_title}>Результатов поиска оказалось немного меньше :(</h1>)}

            {search !== 'null' && search !== ' ' && (<div>
                <div className={style.search_section}>
                    {result?.films?.map((res, key) => (
                        <div className={style.search_item} key={key}>
                            <Link to={`/${res?.nameRu?.includes("сериал") ? "tv-series" : "movies"}/${res?.filmId}`}>
                                <img src={res?.posterUrl} alt={res?.nameRu} className={style.search_image} />
                                <div className={style.item_title}>
                                    <p>{res?.nameRu}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
                
            </div>)}
            <Navigation number={result?.pagesCount}/>
        </div>
    )
}

export default Search
