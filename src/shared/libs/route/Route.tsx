import {createContext, useContext, useEffect, useState} from "react";
import React from "react";


const RouterContext = createContext<any>(null)

export const BrowserRouter = (props: any) => { // BrowserRouter - мы им оборачиваем что бы создать контект
    return <RouterContext.Provider value={{pattern: null}}>
        {props.children}
    </RouterContext.Provider>
}

export const Route = (props: any) => { //Route - отвечает за отслеживание одресной строки браузера, если она меняется он должен перерисовать, если совпадает путь иначе ничего
    // lexical envirinment (1)  // lexical envirinment (2)
    const [_, setVersion] = useState(1) //  1,  _ - это значит что он тут и не нужен
    const value = useContext(RouterContext); // достаем значение из RouterContext

    useEffect(() => {
        const listener = (e: any) => { // вынесли отдельо функцию что бы всегда была 1 ссылка
            setVersion(prevState => prevState + 1 )// когда реакт увидет что 1 меняется на 2 то перерисовывает компонент, prevState - возвращает предыдущий стейт
        }

        (window as any).navigation.addEventListener('navigate', listener);

        return () => {
            (window as any).navigation.removeEventListener('navigate', listener);
        }
    }, [ ])// замыкание

    const currentAddress = window.location.pathname; // то что у нас введено в пути

    if (matchPath(currentAddress, props.path)) { // matchPath - текущий адрес в строке
        value.pattern = props.path
        return props.element
    } else {
        return null
    }
}

export const NavLink = (props) => { // обертка над тегом а, NavLink - задача поменять адрес
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => { // отлавливаем события
        e.preventDefault() // перезагружаем страницу отправляем пользователя по новой ссылке

        window.history.pushState({}, '', props.to); // искусствено подменям строку браузера
    }

    return <a href={props.to} onClick={ handleClick }>{props.children}</a>
}


export const useParams = () => { // useParams - должен вернуть обект, с свойствами которые он собрал
    const currentAddress = window.location.pathname;
    const value = useContext(RouterContext);

    const currentAddressSegments = currentAddress.split('/')
    const patternSegments = value.pattern.split('/') // split - разбивает

    const result = {} as any

    for (let i = 0; i < currentAddressSegments.length; i++) {
        const segmentFromPath = currentAddressSegments[i]
        const segmentFromPattern = patternSegments[i]

        if (segmentFromPattern[0] === ':') {
            result[segmentFromPattern.substring(1)] = segmentFromPath // substring(1) - берет от первого символа и до конца после :
        }

    }

    return result
}

function matchPath(currentAddress: any, pattern: any) {
    const currentAddressSegments = currentAddress.split('/')
    const patternSegments = pattern.split('/')

    if  (currentAddressSegments.length !== patternSegments.length) {
        return false
    } else {
        return true
    }

}