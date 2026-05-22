import { NextResponse } from "next/server";
import { jwtVerify } from "jose";


const middleware = async (request) => {
    const token = request.cookies.get('token')?.value;
    let role;
    if (!token){
        return NextResponse.redirect(new URL("/login", request.url));
    }
    try{
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.SECRET_KEY));
    role = payload.role;
    }catch{
        return NextResponse.redirect(new URL("/login", request.url));
    }
    const protectedRoutes = ["/company", "/candidate", "/admin"];
    const isProtected = protectedRoutes.some(route=>request.nextUrl.pathname.startsWith(route));

    if (isProtected && !token){
        return NextResponse.redirect(new URL("/login", request.url));
    }

    else if (request.nextUrl.pathname.startsWith("/company") && role !== "company"){
        return new NextResponse("Forbidden!", {status: 403});
    }

    else if (request.nextUrl.pathname.startsWith("/candidate") && role !== "candidate"){
        return new NextResponse("Forbidden!", {status: 403});
    }

    else if (request.nextUrl.pathname.startsWith("/admin") && role !== "admin"){
        return new NextResponse("Forbidden!", {status: 403});
    }

    return NextResponse.next();
}
export const config = { 
    matcher: ['/company/:path*', '/candidate/:path*','/admin/:path*']
};