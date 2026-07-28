import {QueryClientProvider} from '@tanstack/react-query';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import queryClient from '@/lib/queryClient';

const AppProvider = ({children}: {children: React.ReactNode}) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        <ReactQueryDevtools initialIsOpen={false}/>
        </QueryClientProvider>
    )
}

export default AppProvider;

