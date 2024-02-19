import { withAuth } from "next-auth/middleware";

export default withAuth;

/* THESE URLS WILL NOT BE ACCESSIBLE WHILE NOT LOGGED-IN */
export const config = {
  matcher: ["/chat", "/chat:ID*", "/register"],
};
