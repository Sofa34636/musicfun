import {useEffect, useRef, useState} from "react";
import type {Entry, QueryFnParams, QueryKey} from "../../shared/libs/query-client/query-client.ts";
import {queryClient} from "../../query-client-instance.ts";


type Options<T> = {
    queryFn: (params: QueryFnParams) => Promise<T> // функция запроса, возвращает промис с данными
    enabled?: boolean, // включен ли запрос
    queryKey: QueryKey // ключ запроса для кэширования
}

export function useQuery<D>(options: Options<D>) {
    const {
        queryFn, // функция, которая получит данные
        enabled = true, // по умолчанию запрос включен
        queryKey // ключ, по которому хранится кэш
    } = options;

    if (!queryKey) { // invariants checking // проверка: если ключа нет, выбросить ошибку
        throw new Error('queryKey is required')
    }

    const initEntry = queryClient.initEntry(queryKey, enabled); // инициализация записи в клиенте

    // const [status, setStatus] = useState<'pending' | 'success' | 'loading'>('loading') // FSM // старый вариант стейта статуса
    // const [data, setData] = useState<D | null>(null) // треки // старый вариант стейта данных

    const [entry, setEntry] = useState<Entry>(initEntry) // стейт записи запроса (данные+статус)
    const abortControllerRef = useRef<AbortController>(null) // контроллер для отмены запроса

    useEffect(() => {
        setEntry(initEntry); // обновляем запись при изменении initEntry
    }, [initEntry])

    useEffect(() => {
        abortControllerRef.current?.abort('Abort because new request') // обрываем связь, если уже был
        // if (!trackId) {
        //     setData(null) // если нам ничего не пришло — чистим стейт
        //     setStatus('pending') // статус ожидания
        //     return
        // }

        if (!enabled) { // если запрос выключен — ничего не делаем
            return
        }

        abortControllerRef.current = new AbortController() // создаём новый контроллер для текущего запроса

        const subscriber = () => { // подписчик на обновление данных
            setEntry({...queryClient.get(queryKey)}); // обновляем стейт из queryClient
        }

        let unsubscribe: () => void; // функция отписки

        // делаем сам fetch через queryClient
        queryClient.fetch(queryFn, queryKey, abortControllerRef.current.signal)
            .then((e) => { // e — это Entry (данные + статус)
                unsubscribe = queryClient.subscribe(queryKey, subscriber) // подписываемся на обновления
                setEntry({...e}) // записываем данные и статус
            });

        return () => {
            unsubscribe?.(); // отписываемся при размонтировании или изменении deps
        }
    }, queryKey) // deps — при изменении ключа повторить запрос

    return {
        data: entry?.data, // данные из запроса
        status: entry?.status ?? 'loading' // статус запроса (по умолчанию 'loading')
    }
}
