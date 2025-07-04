import {PrismaClient} from "@prisma/client"

declare global {
    var prismaClient: PrismaClient | undefined;
}

export const db = globalThis.prismaClient || new PrismaClient();

if(process.env.NODE_ENV !== "production") globalThis.prismaClient = db;





