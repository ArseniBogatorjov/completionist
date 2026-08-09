'use client'

import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {useState} from 'react';


export interface QueryProviderProps {
    children: React.ReactNode;
}

export default function QueryProvider(props: QueryProviderProps) {
    const [client, setClient] = useState<QueryClient>(() => new QueryClient())

    return <QueryClientProvider client={client}>
        {props.children}
    </QueryClientProvider>
}