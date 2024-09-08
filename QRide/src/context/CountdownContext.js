import {createContext,useState} from 'react';

export const CountdownContext=createContext();
export const CountdownProvider=({children})=>{
    const[isCountdownActive,setIsCountdownActive]=useState(false);

    return(
        <CountdownContext.Provider value={{isCountdownActive,setIsCountdownActive}}>
            {children}
        </CountdownContext.Provider>
    )
}