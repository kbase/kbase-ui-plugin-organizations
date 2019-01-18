import * as React from 'react'

export interface AppContext {
    test: string
}

const context = React.createContext<AppContext | null>(null)

export const AppContextProvider = context.Provider
export const AppContextConsumer = context.Consumer