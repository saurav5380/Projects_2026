 import AuthGuard from "@/components/layout/AuthGuard";
import SideBar from "@/components/layout/SideBar";
import TopBar from "@/components/layout/TopBar";

 const Layout = ({children}: {children: React.ReactNode}) => {
    return (
        <>
        <TopBar/>
        <SideBar/>
        <AuthGuard>
            <div>        
            {children}
            </div>
        </AuthGuard>
        </>
    )
 }

 export default Layout;
