import { DEFAULT } from '@/lib/definitions';
import { Prisma, PrismaClient } from '@prisma/client';
import { omit } from 'ramda';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PaginationResult<T extends any[]> = {
  items: T;
  total: number;
  pageCount: number;
};

function _client() {
  return new PrismaClient({
    log: ['query', 'error', 'info', 'warn'],
  });
}

function _pagenateClient() {
  return _client().$extends({
    model: {
      $allModels: {
        async paginate<T, A>(
          this: T,
          args: Prisma.Args<T, 'findMany'> & {
            page: number;
            perPage?: number;
          },
        ): Promise<PaginationResult<Prisma.Result<T, A, 'findMany'>>> {
          const { page, perPage: _perPage } = args;
          const perPage = _perPage || DEFAULT.PER_PAGE;

          const [items, total] = await Promise.all([
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
            (this as any).findMany({
              ...omit(['page', 'perPage'], args),
              skip: perPage * (page - 1),
              take: perPage,
            }),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
            (this as any).count({ where: args.where }),
          ]);
          const pageCount = Math.ceil(total / perPage);

          return { items, total, pageCount };
        },
      },
    },
  });
}

const globalWithPrisma = global as typeof globalThis & { clientCache: typeof clientCache };
const clientCache: {
  client: ReturnType<typeof _client>;
  pagenateClient: ReturnType<typeof _pagenateClient>;
} = globalWithPrisma.clientCache || {};

/**
 * FIXME: prisma clientをpagenateClient側に一本化したい
 * 以下の問題によりclientを分離している
 * 1. jest時にエラーになる
 * jest-prismaが$extendsに対応しておらず、testを書いている箇所に関しては$extendsを使ったclientを使えない
 *
 * 2. middleware上での実行時にエラーになる
 * middlewareはEdgeRuntimeで実行されることもあるが、$extendsを書いてしまうと動作しなくなってしまう模様。
 * prisma(postgreSQL)は2024年9月時点ではEdgeRuntimeでの動作未対応となっているため、実現不可能。
 */
export const client = () => {
  if (!clientCache.client) clientCache.client = _client();
  return clientCache.client;
};

export const pagenateClient = () => {
  if (!clientCache.pagenateClient) clientCache.pagenateClient = _pagenateClient();
  return clientCache.pagenateClient;
};

export default client;

// NOTE: prisma clientが乱立してしまう問題対応としてsingleton化している
// c.f.) https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices
if (process.env.NODE_ENV !== 'production') globalWithPrisma.clientCache = clientCache;

export * from '@prisma/client';
