import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {TracksList} from "./TracksList.tsx";
import {TrackDetail} from "./TrackDetail.tsx";
import {BrowserRouter,  Route, Routes, useParams} from "react-router";
import {AuthLayout, GlobalLayout} from "./layouts/AuthLayout.tsx";
import {CommonLayout} from "./layouts/CommonLayout.tsx";

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
    // const [c, setC] = useState(0);
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                {/*<button onClick={() => setC(c + 1)}> refresh</button>*/}

                <Routes>
                    <Route path={'/:lang?'} element={<GlobalLayout/>}> {/* lang  - язык если есть */}
                        <Route path={"auth"} element={ // теперь auth + login или register(auth/register)
                            <AuthLayout/>}>    {/*базовый роут в котором будет вставляться то что из этих двух выбрано*/}
                            <Route  path="login" element={<Login/>}/>
                            <Route path="register" element={<Register/>}/>
                            <Route path='*' element={<AuthNotFound />} />
                        </Route>

                        <Route element={
                            <CommonLayout/>}>  {/*базовый роут в котором будет вставляться то что из этих двух выбрано*/}
                            <Route path="/" element={
                                <TracksList/>}/> {/* Route - задача следить за адресной строкой браузера и когда там будет соответствие с тем, что в path="/" отрисовать element={<TracksList/>} */}
                            <Route path="/track/:trackId" element={<TrackDetail/>}/>
                        </Route>
                        <Route path='*' element={<NotFound/>}/>
                    </Route>


                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

const Login = () => {
    let {lang} = useParams();
    if (!lang) lang = 'ge' // если lang нет то ge
    return <div>
        lang: {lang}
        <hr/>

        <input/><input/>
        <button>Login</button>
    </div>
}

const Register = () => {
    return <div><input/><input/>
        <button>Register</button>
    </div>
}

const AuthNotFound = () => { // выводит чушь написанную в поисковой строке
    const params = useParams();
    return <h2>Not Found 404 {params['*']}</h2>
}

const NotFound = () => {
    return <h2>Not Found 404</h2>
}