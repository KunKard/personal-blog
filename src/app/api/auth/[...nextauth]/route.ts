import { handlers } from "@/lib/auth/auth";

export const dynamic = "force-static";
export const generateStaticParams = () => [];
export const { GET, POST } = handlers;
