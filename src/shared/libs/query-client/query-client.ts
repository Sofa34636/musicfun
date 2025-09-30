/* eslint-disable */ // отключаем линтер для файла

type Status = 'pending' | 'loading' | 'success'; // возможные статусы запроса

export type Entry = { // то, что мы храним в кэше
    data: any // данные запроса
    status: Status, // текущий статус
    promise?: Promise<any> // незавершённый промис (если идёт запрос)
    subscribers: (() => void)[] // список подписчиков (кто хочет обновление)
}

export type QueryFnParams = { // параметры, которые передаются в queryFn
    signal?: AbortSignal // чтобы уметь отменять fetch
}

export type QueryFn = (params: QueryFnParams) => Promise<any> // тип функции запроса

export type QueryKey = Array<string | number | null> // тип ключа запроса

export class QueryClient { // клиент, который управляет кэшем
    private cache = new Map<string, Entry>() // кэш всех запросов

    async fetch(queryFn: QueryFn, queryKey: QueryKey, signal?: AbortSignal): Promise<Entry> {
        const entry = this.cache.get(queryKey.toString())! // достаем entry по ключу

        if (entry.promise) { // если запрос уже выполняется
            return entry; // возвращаем entry
        }

        if (entry.data) { // если данные уже есть
            return entry; // возвращаем entry
        }

        const functionPromise = queryFn({ // вызываем queryFn (например fetch)
            signal // передаем сигнал отмены
        })
        entry.promise = functionPromise // сохраняем промис, пока он не выполнится

        try {
            const json = await functionPromise // ждём данные

            entry.data = json // кладём результат
            entry.status = 'success' // ставим статус
            entry.subscribers.forEach(subscriber => subscriber()) // уведомляем подписчиков
        } catch {
            console.log('Request was aborted') // если отменили — пишем в консоль
        }
        entry.promise = undefined // очищаем промис
        return entry; // возвращаем entry
    }

    initEntry(queryKey: QueryKey, enabled: boolean) {
        if (!this.cache.has(queryKey.toString())) { // если нет записи по ключу
            this.cache.set(queryKey.toString(), { // создаём её
                data: null, // данных пока нет
                status: enabled ? 'loading' : 'pending', // статус в зависимости от enabled
                promise: undefined, // промиса пока нет
                subscribers: [] // подписчиков пока нет
            })
        }

        return this.cache.get(queryKey.toString())!; // возвращаем entry
    }

    subscribe(queryKey: QueryKey, callback: () => void) { // подписка на изменения entry
        this.cache.get(queryKey.toString())?.subscribers.push(callback) // добавляем подписчика

        return () => { // возвращаем функцию для отписки
            const subscribers = this.cache.get(queryKey.toString())!.subscribers; // достаем массив подписчиков
            const index = subscribers.indexOf(callback); // ищем нашего
            if (index !== -1) { // если нашли
                subscribers.splice(index, 1); // удаляем
            }
        }
    }

    // unsubscribe(queryKey: QueryKey, callback: () => void){
    //     // старый вариант отписки (сейчас делаем через return в subscribe)
    // }

    get(queryKey: QueryKey) { // получить данные напрямую
        return this.cache.get(queryKey.toString())! // возвращаем entry
    }

}
