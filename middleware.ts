import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/signin",
    },
});

export const config = {
    matcher: [
        "/((?!signin|signup|api/auth|_next|favicon.ico|.*\\.).*)"
    ]
};
