import {MainPage} from "./MainPage.tsx";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: Infinity, // данные всегда будут свежими, даже при переключении вкладок не будет лишних запросов
            gcTime: 10 * 1000 // но если у данных нет подписчиков, то сборщик их удалит
        }
    }
});
// @ts-expect-error we dont need typing
window.__TANSTACK_QUERY_CLIENT__ = queryClient; // сделали обект доступным глобально


export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <MainPage />
        </QueryClientProvider>
    )
}