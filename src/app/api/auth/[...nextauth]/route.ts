import { handlers } from "@/auth";

// NextAuth handles all OAuth redirects and callbacks automatically
export const { GET, POST } = handlers;
