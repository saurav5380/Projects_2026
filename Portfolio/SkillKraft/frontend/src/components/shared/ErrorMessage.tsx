import { Alert, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";
const ErrorMessage = ({ message }: { message: string }) => {
    return (
        <div className="flex justify-center my-12">
        <Alert variant="destructive" className="bg-danger-soft border-danger/40 text-danger max-w-sm max-h-md w-fit">
            <TriangleAlert/>
            <AlertTitle>
                {message}
            </AlertTitle>
        </Alert>
        </div>
    )
}


export default ErrorMessage;

