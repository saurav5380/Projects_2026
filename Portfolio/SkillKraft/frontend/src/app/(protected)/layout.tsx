 import AuthGuard from "@/components/layout/AuthGuard";

 const Layout = ({children}: {children: React.ReactNode}) => {
    return (
        <>
        <AuthGuard>
            <div>
            {children}
            </div>
        </AuthGuard>
        </>
    )
 }

 export default Layout;
