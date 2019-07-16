import { observable } from "mobx"
import React = require("react")

export class AppState {
    @observable name: string = ''
    @observable email: string = ''
}

export interface AppContextType {
    state: AppState
}

export const AppContext = React.createContext<AppContextType>({ state: new AppState() })
