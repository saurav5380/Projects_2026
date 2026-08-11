
import { PageHeaderProps } from "@/app/types/api.types";

const PageHeader = ({title, subtitle = ""}: PageHeaderProps)  => {
    return (
        <>
        <div className="flex flex-col justify-center items-center gap-8 mt-4">
        <h1 className="text-3xl font-bold tracking-tight font-sans text-text-primary">{title}</h1>
        <h2 className="text-sm font-normal text-text-secondary">{subtitle}</h2>
        </div>
        </>
    )
}

export default PageHeader;