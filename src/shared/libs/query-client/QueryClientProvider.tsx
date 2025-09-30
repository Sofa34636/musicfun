import type {QueryClient} from "./query-client.ts";
import {QueryClientContext as QueryClientContext1} from "./QueryClientContext.tsx";
import type {PropsWithChildren} from "react";

export type Props = {
    client: QueryClient
}
export const QueryClientProvider = ({client, children}: PropsWithChildren<Props>) => {
    return (
        <QueryClientContext1 value={client}>
            {children}
        </QueryClientContext1>
    )
}