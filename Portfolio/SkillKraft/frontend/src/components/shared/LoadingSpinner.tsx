
import { Spinner } from "../ui/spinner";
const LoadingSpinner = () => {
    return (
        <>
        <div className="mt-12 w-full min-h-screen flex flex-col gap-4 justify-center items-center text-xl"> 
            <Spinner className="size-8 text-brand"/>
            <span className="text-text-secondary">Loading...</span>
        </div>
        </>
    )
}

export default LoadingSpinner;
