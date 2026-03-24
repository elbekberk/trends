
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Post
 * 
 */
export type Post = $Result.DefaultSelection<Prisma.$PostPayload>
/**
 * Model TopicHit
 * 
 */
export type TopicHit = $Result.DefaultSelection<Prisma.$TopicHitPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Posts
 * const posts = await prisma.post.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Posts
   * const posts = await prisma.post.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.post`: Exposes CRUD operations for the **Post** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Posts
    * const posts = await prisma.post.findMany()
    * ```
    */
  get post(): Prisma.PostDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.topicHit`: Exposes CRUD operations for the **TopicHit** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TopicHits
    * const topicHits = await prisma.topicHit.findMany()
    * ```
    */
  get topicHit(): Prisma.TopicHitDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.2
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Post: 'Post',
    TopicHit: 'TopicHit'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "post" | "topicHit"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Post: {
        payload: Prisma.$PostPayload<ExtArgs>
        fields: Prisma.PostFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PostFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PostFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findFirst: {
            args: Prisma.PostFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PostFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          findMany: {
            args: Prisma.PostFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          create: {
            args: Prisma.PostCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          createMany: {
            args: Prisma.PostCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PostCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          delete: {
            args: Prisma.PostDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          update: {
            args: Prisma.PostUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          deleteMany: {
            args: Prisma.PostDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PostUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PostUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>[]
          }
          upsert: {
            args: Prisma.PostUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PostPayload>
          }
          aggregate: {
            args: Prisma.PostAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePost>
          }
          groupBy: {
            args: Prisma.PostGroupByArgs<ExtArgs>
            result: $Utils.Optional<PostGroupByOutputType>[]
          }
          count: {
            args: Prisma.PostCountArgs<ExtArgs>
            result: $Utils.Optional<PostCountAggregateOutputType> | number
          }
        }
      }
      TopicHit: {
        payload: Prisma.$TopicHitPayload<ExtArgs>
        fields: Prisma.TopicHitFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TopicHitFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicHitPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TopicHitFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicHitPayload>
          }
          findFirst: {
            args: Prisma.TopicHitFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicHitPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TopicHitFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicHitPayload>
          }
          findMany: {
            args: Prisma.TopicHitFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicHitPayload>[]
          }
          create: {
            args: Prisma.TopicHitCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicHitPayload>
          }
          createMany: {
            args: Prisma.TopicHitCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TopicHitCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicHitPayload>[]
          }
          delete: {
            args: Prisma.TopicHitDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicHitPayload>
          }
          update: {
            args: Prisma.TopicHitUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicHitPayload>
          }
          deleteMany: {
            args: Prisma.TopicHitDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TopicHitUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TopicHitUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicHitPayload>[]
          }
          upsert: {
            args: Prisma.TopicHitUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicHitPayload>
          }
          aggregate: {
            args: Prisma.TopicHitAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTopicHit>
          }
          groupBy: {
            args: Prisma.TopicHitGroupByArgs<ExtArgs>
            result: $Utils.Optional<TopicHitGroupByOutputType>[]
          }
          count: {
            args: Prisma.TopicHitCountArgs<ExtArgs>
            result: $Utils.Optional<TopicHitCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    post?: PostOmit
    topicHit?: TopicHitOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type PostCountOutputType
   */

  export type PostCountOutputType = {
    topicHits: number
  }

  export type PostCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    topicHits?: boolean | PostCountOutputTypeCountTopicHitsArgs
  }

  // Custom InputTypes
  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PostCountOutputType
     */
    select?: PostCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PostCountOutputType without action
   */
  export type PostCountOutputTypeCountTopicHitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicHitWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Post
   */

  export type AggregatePost = {
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  export type PostAvgAggregateOutputType = {
    id: number | null
  }

  export type PostSumAggregateOutputType = {
    id: number | null
  }

  export type PostMinAggregateOutputType = {
    id: number | null
    source: string | null
    externalId: string | null
    title: string | null
    url: string | null
    createdAt: Date | null
    fetchedAt: Date | null
  }

  export type PostMaxAggregateOutputType = {
    id: number | null
    source: string | null
    externalId: string | null
    title: string | null
    url: string | null
    createdAt: Date | null
    fetchedAt: Date | null
  }

  export type PostCountAggregateOutputType = {
    id: number
    source: number
    externalId: number
    title: number
    url: number
    createdAt: number
    fetchedAt: number
    _all: number
  }


  export type PostAvgAggregateInputType = {
    id?: true
  }

  export type PostSumAggregateInputType = {
    id?: true
  }

  export type PostMinAggregateInputType = {
    id?: true
    source?: true
    externalId?: true
    title?: true
    url?: true
    createdAt?: true
    fetchedAt?: true
  }

  export type PostMaxAggregateInputType = {
    id?: true
    source?: true
    externalId?: true
    title?: true
    url?: true
    createdAt?: true
    fetchedAt?: true
  }

  export type PostCountAggregateInputType = {
    id?: true
    source?: true
    externalId?: true
    title?: true
    url?: true
    createdAt?: true
    fetchedAt?: true
    _all?: true
  }

  export type PostAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Post to aggregate.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Posts
    **/
    _count?: true | PostCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PostAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PostSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PostMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PostMaxAggregateInputType
  }

  export type GetPostAggregateType<T extends PostAggregateArgs> = {
        [P in keyof T & keyof AggregatePost]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePost[P]>
      : GetScalarType<T[P], AggregatePost[P]>
  }




  export type PostGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PostWhereInput
    orderBy?: PostOrderByWithAggregationInput | PostOrderByWithAggregationInput[]
    by: PostScalarFieldEnum[] | PostScalarFieldEnum
    having?: PostScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PostCountAggregateInputType | true
    _avg?: PostAvgAggregateInputType
    _sum?: PostSumAggregateInputType
    _min?: PostMinAggregateInputType
    _max?: PostMaxAggregateInputType
  }

  export type PostGroupByOutputType = {
    id: number
    source: string
    externalId: string
    title: string
    url: string | null
    createdAt: Date | null
    fetchedAt: Date
    _count: PostCountAggregateOutputType | null
    _avg: PostAvgAggregateOutputType | null
    _sum: PostSumAggregateOutputType | null
    _min: PostMinAggregateOutputType | null
    _max: PostMaxAggregateOutputType | null
  }

  type GetPostGroupByPayload<T extends PostGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PostGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PostGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PostGroupByOutputType[P]>
            : GetScalarType<T[P], PostGroupByOutputType[P]>
        }
      >
    >


  export type PostSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source?: boolean
    externalId?: boolean
    title?: boolean
    url?: boolean
    createdAt?: boolean
    fetchedAt?: boolean
    topicHits?: boolean | Post$topicHitsArgs<ExtArgs>
    _count?: boolean | PostCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>

  export type PostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source?: boolean
    externalId?: boolean
    title?: boolean
    url?: boolean
    createdAt?: boolean
    fetchedAt?: boolean
  }, ExtArgs["result"]["post"]>

  export type PostSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source?: boolean
    externalId?: boolean
    title?: boolean
    url?: boolean
    createdAt?: boolean
    fetchedAt?: boolean
  }, ExtArgs["result"]["post"]>

  export type PostSelectScalar = {
    id?: boolean
    source?: boolean
    externalId?: boolean
    title?: boolean
    url?: boolean
    createdAt?: boolean
    fetchedAt?: boolean
  }

  export type PostOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "source" | "externalId" | "title" | "url" | "createdAt" | "fetchedAt", ExtArgs["result"]["post"]>
  export type PostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    topicHits?: boolean | Post$topicHitsArgs<ExtArgs>
    _count?: boolean | PostCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PostIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PostIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Post"
    objects: {
      topicHits: Prisma.$TopicHitPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      source: string
      externalId: string
      title: string
      url: string | null
      createdAt: Date | null
      fetchedAt: Date
    }, ExtArgs["result"]["post"]>
    composites: {}
  }

  type PostGetPayload<S extends boolean | null | undefined | PostDefaultArgs> = $Result.GetResult<Prisma.$PostPayload, S>

  type PostCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PostFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PostCountAggregateInputType | true
    }

  export interface PostDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Post'], meta: { name: 'Post' } }
    /**
     * Find zero or one Post that matches the filter.
     * @param {PostFindUniqueArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PostFindUniqueArgs>(args: SelectSubset<T, PostFindUniqueArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Post that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PostFindUniqueOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PostFindUniqueOrThrowArgs>(args: SelectSubset<T, PostFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PostFindFirstArgs>(args?: SelectSubset<T, PostFindFirstArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Post that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindFirstOrThrowArgs} args - Arguments to find a Post
     * @example
     * // Get one Post
     * const post = await prisma.post.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PostFindFirstOrThrowArgs>(args?: SelectSubset<T, PostFindFirstOrThrowArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Posts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Posts
     * const posts = await prisma.post.findMany()
     * 
     * // Get first 10 Posts
     * const posts = await prisma.post.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const postWithIdOnly = await prisma.post.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PostFindManyArgs>(args?: SelectSubset<T, PostFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Post.
     * @param {PostCreateArgs} args - Arguments to create a Post.
     * @example
     * // Create one Post
     * const Post = await prisma.post.create({
     *   data: {
     *     // ... data to create a Post
     *   }
     * })
     * 
     */
    create<T extends PostCreateArgs>(args: SelectSubset<T, PostCreateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Posts.
     * @param {PostCreateManyArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PostCreateManyArgs>(args?: SelectSubset<T, PostCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Posts and returns the data saved in the database.
     * @param {PostCreateManyAndReturnArgs} args - Arguments to create many Posts.
     * @example
     * // Create many Posts
     * const post = await prisma.post.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PostCreateManyAndReturnArgs>(args?: SelectSubset<T, PostCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Post.
     * @param {PostDeleteArgs} args - Arguments to delete one Post.
     * @example
     * // Delete one Post
     * const Post = await prisma.post.delete({
     *   where: {
     *     // ... filter to delete one Post
     *   }
     * })
     * 
     */
    delete<T extends PostDeleteArgs>(args: SelectSubset<T, PostDeleteArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Post.
     * @param {PostUpdateArgs} args - Arguments to update one Post.
     * @example
     * // Update one Post
     * const post = await prisma.post.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PostUpdateArgs>(args: SelectSubset<T, PostUpdateArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Posts.
     * @param {PostDeleteManyArgs} args - Arguments to filter Posts to delete.
     * @example
     * // Delete a few Posts
     * const { count } = await prisma.post.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PostDeleteManyArgs>(args?: SelectSubset<T, PostDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PostUpdateManyArgs>(args: SelectSubset<T, PostUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Posts and returns the data updated in the database.
     * @param {PostUpdateManyAndReturnArgs} args - Arguments to update many Posts.
     * @example
     * // Update many Posts
     * const post = await prisma.post.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Posts and only return the `id`
     * const postWithIdOnly = await prisma.post.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PostUpdateManyAndReturnArgs>(args: SelectSubset<T, PostUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Post.
     * @param {PostUpsertArgs} args - Arguments to update or create a Post.
     * @example
     * // Update or create a Post
     * const post = await prisma.post.upsert({
     *   create: {
     *     // ... data to create a Post
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Post we want to update
     *   }
     * })
     */
    upsert<T extends PostUpsertArgs>(args: SelectSubset<T, PostUpsertArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Posts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostCountArgs} args - Arguments to filter Posts to count.
     * @example
     * // Count the number of Posts
     * const count = await prisma.post.count({
     *   where: {
     *     // ... the filter for the Posts we want to count
     *   }
     * })
    **/
    count<T extends PostCountArgs>(
      args?: Subset<T, PostCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PostCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PostAggregateArgs>(args: Subset<T, PostAggregateArgs>): Prisma.PrismaPromise<GetPostAggregateType<T>>

    /**
     * Group by Post.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PostGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PostGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PostGroupByArgs['orderBy'] }
        : { orderBy?: PostGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PostGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPostGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Post model
   */
  readonly fields: PostFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Post.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PostClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    topicHits<T extends Post$topicHitsArgs<ExtArgs> = {}>(args?: Subset<T, Post$topicHitsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicHitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Post model
   */
  interface PostFieldRefs {
    readonly id: FieldRef<"Post", 'Int'>
    readonly source: FieldRef<"Post", 'String'>
    readonly externalId: FieldRef<"Post", 'String'>
    readonly title: FieldRef<"Post", 'String'>
    readonly url: FieldRef<"Post", 'String'>
    readonly createdAt: FieldRef<"Post", 'DateTime'>
    readonly fetchedAt: FieldRef<"Post", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Post findUnique
   */
  export type PostFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findUniqueOrThrow
   */
  export type PostFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post findFirst
   */
  export type PostFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findFirstOrThrow
   */
  export type PostFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Post to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Posts.
     */
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post findMany
   */
  export type PostFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter, which Posts to fetch.
     */
    where?: PostWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Posts to fetch.
     */
    orderBy?: PostOrderByWithRelationInput | PostOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Posts.
     */
    cursor?: PostWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Posts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Posts.
     */
    skip?: number
    distinct?: PostScalarFieldEnum | PostScalarFieldEnum[]
  }

  /**
   * Post create
   */
  export type PostCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to create a Post.
     */
    data: XOR<PostCreateInput, PostUncheckedCreateInput>
  }

  /**
   * Post createMany
   */
  export type PostCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
  }

  /**
   * Post createManyAndReturn
   */
  export type PostCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data used to create many Posts.
     */
    data: PostCreateManyInput | PostCreateManyInput[]
  }

  /**
   * Post update
   */
  export type PostUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The data needed to update a Post.
     */
    data: XOR<PostUpdateInput, PostUncheckedUpdateInput>
    /**
     * Choose, which Post to update.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post updateMany
   */
  export type PostUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to update.
     */
    limit?: number
  }

  /**
   * Post updateManyAndReturn
   */
  export type PostUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * The data used to update Posts.
     */
    data: XOR<PostUpdateManyMutationInput, PostUncheckedUpdateManyInput>
    /**
     * Filter which Posts to update
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to update.
     */
    limit?: number
  }

  /**
   * Post upsert
   */
  export type PostUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * The filter to search for the Post to update in case it exists.
     */
    where: PostWhereUniqueInput
    /**
     * In case the Post found by the `where` argument doesn't exist, create a new Post with this data.
     */
    create: XOR<PostCreateInput, PostUncheckedCreateInput>
    /**
     * In case the Post was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PostUpdateInput, PostUncheckedUpdateInput>
  }

  /**
   * Post delete
   */
  export type PostDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
    /**
     * Filter which Post to delete.
     */
    where: PostWhereUniqueInput
  }

  /**
   * Post deleteMany
   */
  export type PostDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Posts to delete
     */
    where?: PostWhereInput
    /**
     * Limit how many Posts to delete.
     */
    limit?: number
  }

  /**
   * Post.topicHits
   */
  export type Post$topicHitsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicHit
     */
    select?: TopicHitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicHit
     */
    omit?: TopicHitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicHitInclude<ExtArgs> | null
    where?: TopicHitWhereInput
    orderBy?: TopicHitOrderByWithRelationInput | TopicHitOrderByWithRelationInput[]
    cursor?: TopicHitWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TopicHitScalarFieldEnum | TopicHitScalarFieldEnum[]
  }

  /**
   * Post without action
   */
  export type PostDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Post
     */
    select?: PostSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Post
     */
    omit?: PostOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PostInclude<ExtArgs> | null
  }


  /**
   * Model TopicHit
   */

  export type AggregateTopicHit = {
    _count: TopicHitCountAggregateOutputType | null
    _avg: TopicHitAvgAggregateOutputType | null
    _sum: TopicHitSumAggregateOutputType | null
    _min: TopicHitMinAggregateOutputType | null
    _max: TopicHitMaxAggregateOutputType | null
  }

  export type TopicHitAvgAggregateOutputType = {
    id: number | null
    postId: number | null
  }

  export type TopicHitSumAggregateOutputType = {
    id: number | null
    postId: number | null
  }

  export type TopicHitMinAggregateOutputType = {
    id: number | null
    bucketTime: Date | null
    category: string | null
    parentKey: string | null
    parentLabel: string | null
    canonicalParentKey: string | null
    canonicalParentLabel: string | null
    childKey: string | null
    childLabel: string | null
    postId: number | null
    createdAt: Date | null
  }

  export type TopicHitMaxAggregateOutputType = {
    id: number | null
    bucketTime: Date | null
    category: string | null
    parentKey: string | null
    parentLabel: string | null
    canonicalParentKey: string | null
    canonicalParentLabel: string | null
    childKey: string | null
    childLabel: string | null
    postId: number | null
    createdAt: Date | null
  }

  export type TopicHitCountAggregateOutputType = {
    id: number
    bucketTime: number
    category: number
    parentKey: number
    parentLabel: number
    canonicalParentKey: number
    canonicalParentLabel: number
    childKey: number
    childLabel: number
    postId: number
    createdAt: number
    _all: number
  }


  export type TopicHitAvgAggregateInputType = {
    id?: true
    postId?: true
  }

  export type TopicHitSumAggregateInputType = {
    id?: true
    postId?: true
  }

  export type TopicHitMinAggregateInputType = {
    id?: true
    bucketTime?: true
    category?: true
    parentKey?: true
    parentLabel?: true
    canonicalParentKey?: true
    canonicalParentLabel?: true
    childKey?: true
    childLabel?: true
    postId?: true
    createdAt?: true
  }

  export type TopicHitMaxAggregateInputType = {
    id?: true
    bucketTime?: true
    category?: true
    parentKey?: true
    parentLabel?: true
    canonicalParentKey?: true
    canonicalParentLabel?: true
    childKey?: true
    childLabel?: true
    postId?: true
    createdAt?: true
  }

  export type TopicHitCountAggregateInputType = {
    id?: true
    bucketTime?: true
    category?: true
    parentKey?: true
    parentLabel?: true
    canonicalParentKey?: true
    canonicalParentLabel?: true
    childKey?: true
    childLabel?: true
    postId?: true
    createdAt?: true
    _all?: true
  }

  export type TopicHitAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TopicHit to aggregate.
     */
    where?: TopicHitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicHits to fetch.
     */
    orderBy?: TopicHitOrderByWithRelationInput | TopicHitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TopicHitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicHits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicHits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TopicHits
    **/
    _count?: true | TopicHitCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TopicHitAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TopicHitSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TopicHitMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TopicHitMaxAggregateInputType
  }

  export type GetTopicHitAggregateType<T extends TopicHitAggregateArgs> = {
        [P in keyof T & keyof AggregateTopicHit]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTopicHit[P]>
      : GetScalarType<T[P], AggregateTopicHit[P]>
  }




  export type TopicHitGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicHitWhereInput
    orderBy?: TopicHitOrderByWithAggregationInput | TopicHitOrderByWithAggregationInput[]
    by: TopicHitScalarFieldEnum[] | TopicHitScalarFieldEnum
    having?: TopicHitScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TopicHitCountAggregateInputType | true
    _avg?: TopicHitAvgAggregateInputType
    _sum?: TopicHitSumAggregateInputType
    _min?: TopicHitMinAggregateInputType
    _max?: TopicHitMaxAggregateInputType
  }

  export type TopicHitGroupByOutputType = {
    id: number
    bucketTime: Date
    category: string
    parentKey: string
    parentLabel: string
    canonicalParentKey: string | null
    canonicalParentLabel: string | null
    childKey: string | null
    childLabel: string | null
    postId: number
    createdAt: Date
    _count: TopicHitCountAggregateOutputType | null
    _avg: TopicHitAvgAggregateOutputType | null
    _sum: TopicHitSumAggregateOutputType | null
    _min: TopicHitMinAggregateOutputType | null
    _max: TopicHitMaxAggregateOutputType | null
  }

  type GetTopicHitGroupByPayload<T extends TopicHitGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TopicHitGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TopicHitGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TopicHitGroupByOutputType[P]>
            : GetScalarType<T[P], TopicHitGroupByOutputType[P]>
        }
      >
    >


  export type TopicHitSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bucketTime?: boolean
    category?: boolean
    parentKey?: boolean
    parentLabel?: boolean
    canonicalParentKey?: boolean
    canonicalParentLabel?: boolean
    childKey?: boolean
    childLabel?: boolean
    postId?: boolean
    createdAt?: boolean
    post?: boolean | PostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["topicHit"]>

  export type TopicHitSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bucketTime?: boolean
    category?: boolean
    parentKey?: boolean
    parentLabel?: boolean
    canonicalParentKey?: boolean
    canonicalParentLabel?: boolean
    childKey?: boolean
    childLabel?: boolean
    postId?: boolean
    createdAt?: boolean
    post?: boolean | PostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["topicHit"]>

  export type TopicHitSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    bucketTime?: boolean
    category?: boolean
    parentKey?: boolean
    parentLabel?: boolean
    canonicalParentKey?: boolean
    canonicalParentLabel?: boolean
    childKey?: boolean
    childLabel?: boolean
    postId?: boolean
    createdAt?: boolean
    post?: boolean | PostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["topicHit"]>

  export type TopicHitSelectScalar = {
    id?: boolean
    bucketTime?: boolean
    category?: boolean
    parentKey?: boolean
    parentLabel?: boolean
    canonicalParentKey?: boolean
    canonicalParentLabel?: boolean
    childKey?: boolean
    childLabel?: boolean
    postId?: boolean
    createdAt?: boolean
  }

  export type TopicHitOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "bucketTime" | "category" | "parentKey" | "parentLabel" | "canonicalParentKey" | "canonicalParentLabel" | "childKey" | "childLabel" | "postId" | "createdAt", ExtArgs["result"]["topicHit"]>
  export type TopicHitInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | PostDefaultArgs<ExtArgs>
  }
  export type TopicHitIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | PostDefaultArgs<ExtArgs>
  }
  export type TopicHitIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | PostDefaultArgs<ExtArgs>
  }

  export type $TopicHitPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TopicHit"
    objects: {
      post: Prisma.$PostPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      bucketTime: Date
      category: string
      parentKey: string
      parentLabel: string
      canonicalParentKey: string | null
      canonicalParentLabel: string | null
      childKey: string | null
      childLabel: string | null
      postId: number
      createdAt: Date
    }, ExtArgs["result"]["topicHit"]>
    composites: {}
  }

  type TopicHitGetPayload<S extends boolean | null | undefined | TopicHitDefaultArgs> = $Result.GetResult<Prisma.$TopicHitPayload, S>

  type TopicHitCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TopicHitFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TopicHitCountAggregateInputType | true
    }

  export interface TopicHitDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TopicHit'], meta: { name: 'TopicHit' } }
    /**
     * Find zero or one TopicHit that matches the filter.
     * @param {TopicHitFindUniqueArgs} args - Arguments to find a TopicHit
     * @example
     * // Get one TopicHit
     * const topicHit = await prisma.topicHit.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TopicHitFindUniqueArgs>(args: SelectSubset<T, TopicHitFindUniqueArgs<ExtArgs>>): Prisma__TopicHitClient<$Result.GetResult<Prisma.$TopicHitPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TopicHit that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TopicHitFindUniqueOrThrowArgs} args - Arguments to find a TopicHit
     * @example
     * // Get one TopicHit
     * const topicHit = await prisma.topicHit.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TopicHitFindUniqueOrThrowArgs>(args: SelectSubset<T, TopicHitFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TopicHitClient<$Result.GetResult<Prisma.$TopicHitPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TopicHit that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicHitFindFirstArgs} args - Arguments to find a TopicHit
     * @example
     * // Get one TopicHit
     * const topicHit = await prisma.topicHit.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TopicHitFindFirstArgs>(args?: SelectSubset<T, TopicHitFindFirstArgs<ExtArgs>>): Prisma__TopicHitClient<$Result.GetResult<Prisma.$TopicHitPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TopicHit that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicHitFindFirstOrThrowArgs} args - Arguments to find a TopicHit
     * @example
     * // Get one TopicHit
     * const topicHit = await prisma.topicHit.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TopicHitFindFirstOrThrowArgs>(args?: SelectSubset<T, TopicHitFindFirstOrThrowArgs<ExtArgs>>): Prisma__TopicHitClient<$Result.GetResult<Prisma.$TopicHitPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TopicHits that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicHitFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TopicHits
     * const topicHits = await prisma.topicHit.findMany()
     * 
     * // Get first 10 TopicHits
     * const topicHits = await prisma.topicHit.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const topicHitWithIdOnly = await prisma.topicHit.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TopicHitFindManyArgs>(args?: SelectSubset<T, TopicHitFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicHitPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TopicHit.
     * @param {TopicHitCreateArgs} args - Arguments to create a TopicHit.
     * @example
     * // Create one TopicHit
     * const TopicHit = await prisma.topicHit.create({
     *   data: {
     *     // ... data to create a TopicHit
     *   }
     * })
     * 
     */
    create<T extends TopicHitCreateArgs>(args: SelectSubset<T, TopicHitCreateArgs<ExtArgs>>): Prisma__TopicHitClient<$Result.GetResult<Prisma.$TopicHitPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TopicHits.
     * @param {TopicHitCreateManyArgs} args - Arguments to create many TopicHits.
     * @example
     * // Create many TopicHits
     * const topicHit = await prisma.topicHit.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TopicHitCreateManyArgs>(args?: SelectSubset<T, TopicHitCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TopicHits and returns the data saved in the database.
     * @param {TopicHitCreateManyAndReturnArgs} args - Arguments to create many TopicHits.
     * @example
     * // Create many TopicHits
     * const topicHit = await prisma.topicHit.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TopicHits and only return the `id`
     * const topicHitWithIdOnly = await prisma.topicHit.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TopicHitCreateManyAndReturnArgs>(args?: SelectSubset<T, TopicHitCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicHitPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TopicHit.
     * @param {TopicHitDeleteArgs} args - Arguments to delete one TopicHit.
     * @example
     * // Delete one TopicHit
     * const TopicHit = await prisma.topicHit.delete({
     *   where: {
     *     // ... filter to delete one TopicHit
     *   }
     * })
     * 
     */
    delete<T extends TopicHitDeleteArgs>(args: SelectSubset<T, TopicHitDeleteArgs<ExtArgs>>): Prisma__TopicHitClient<$Result.GetResult<Prisma.$TopicHitPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TopicHit.
     * @param {TopicHitUpdateArgs} args - Arguments to update one TopicHit.
     * @example
     * // Update one TopicHit
     * const topicHit = await prisma.topicHit.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TopicHitUpdateArgs>(args: SelectSubset<T, TopicHitUpdateArgs<ExtArgs>>): Prisma__TopicHitClient<$Result.GetResult<Prisma.$TopicHitPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TopicHits.
     * @param {TopicHitDeleteManyArgs} args - Arguments to filter TopicHits to delete.
     * @example
     * // Delete a few TopicHits
     * const { count } = await prisma.topicHit.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TopicHitDeleteManyArgs>(args?: SelectSubset<T, TopicHitDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TopicHits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicHitUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TopicHits
     * const topicHit = await prisma.topicHit.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TopicHitUpdateManyArgs>(args: SelectSubset<T, TopicHitUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TopicHits and returns the data updated in the database.
     * @param {TopicHitUpdateManyAndReturnArgs} args - Arguments to update many TopicHits.
     * @example
     * // Update many TopicHits
     * const topicHit = await prisma.topicHit.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TopicHits and only return the `id`
     * const topicHitWithIdOnly = await prisma.topicHit.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TopicHitUpdateManyAndReturnArgs>(args: SelectSubset<T, TopicHitUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicHitPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TopicHit.
     * @param {TopicHitUpsertArgs} args - Arguments to update or create a TopicHit.
     * @example
     * // Update or create a TopicHit
     * const topicHit = await prisma.topicHit.upsert({
     *   create: {
     *     // ... data to create a TopicHit
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TopicHit we want to update
     *   }
     * })
     */
    upsert<T extends TopicHitUpsertArgs>(args: SelectSubset<T, TopicHitUpsertArgs<ExtArgs>>): Prisma__TopicHitClient<$Result.GetResult<Prisma.$TopicHitPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TopicHits.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicHitCountArgs} args - Arguments to filter TopicHits to count.
     * @example
     * // Count the number of TopicHits
     * const count = await prisma.topicHit.count({
     *   where: {
     *     // ... the filter for the TopicHits we want to count
     *   }
     * })
    **/
    count<T extends TopicHitCountArgs>(
      args?: Subset<T, TopicHitCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TopicHitCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TopicHit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicHitAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TopicHitAggregateArgs>(args: Subset<T, TopicHitAggregateArgs>): Prisma.PrismaPromise<GetTopicHitAggregateType<T>>

    /**
     * Group by TopicHit.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicHitGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TopicHitGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TopicHitGroupByArgs['orderBy'] }
        : { orderBy?: TopicHitGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TopicHitGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTopicHitGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TopicHit model
   */
  readonly fields: TopicHitFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TopicHit.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TopicHitClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    post<T extends PostDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PostDefaultArgs<ExtArgs>>): Prisma__PostClient<$Result.GetResult<Prisma.$PostPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the TopicHit model
   */
  interface TopicHitFieldRefs {
    readonly id: FieldRef<"TopicHit", 'Int'>
    readonly bucketTime: FieldRef<"TopicHit", 'DateTime'>
    readonly category: FieldRef<"TopicHit", 'String'>
    readonly parentKey: FieldRef<"TopicHit", 'String'>
    readonly parentLabel: FieldRef<"TopicHit", 'String'>
    readonly canonicalParentKey: FieldRef<"TopicHit", 'String'>
    readonly canonicalParentLabel: FieldRef<"TopicHit", 'String'>
    readonly childKey: FieldRef<"TopicHit", 'String'>
    readonly childLabel: FieldRef<"TopicHit", 'String'>
    readonly postId: FieldRef<"TopicHit", 'Int'>
    readonly createdAt: FieldRef<"TopicHit", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TopicHit findUnique
   */
  export type TopicHitFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicHit
     */
    select?: TopicHitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicHit
     */
    omit?: TopicHitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicHitInclude<ExtArgs> | null
    /**
     * Filter, which TopicHit to fetch.
     */
    where: TopicHitWhereUniqueInput
  }

  /**
   * TopicHit findUniqueOrThrow
   */
  export type TopicHitFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicHit
     */
    select?: TopicHitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicHit
     */
    omit?: TopicHitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicHitInclude<ExtArgs> | null
    /**
     * Filter, which TopicHit to fetch.
     */
    where: TopicHitWhereUniqueInput
  }

  /**
   * TopicHit findFirst
   */
  export type TopicHitFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicHit
     */
    select?: TopicHitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicHit
     */
    omit?: TopicHitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicHitInclude<ExtArgs> | null
    /**
     * Filter, which TopicHit to fetch.
     */
    where?: TopicHitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicHits to fetch.
     */
    orderBy?: TopicHitOrderByWithRelationInput | TopicHitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TopicHits.
     */
    cursor?: TopicHitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicHits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicHits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TopicHits.
     */
    distinct?: TopicHitScalarFieldEnum | TopicHitScalarFieldEnum[]
  }

  /**
   * TopicHit findFirstOrThrow
   */
  export type TopicHitFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicHit
     */
    select?: TopicHitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicHit
     */
    omit?: TopicHitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicHitInclude<ExtArgs> | null
    /**
     * Filter, which TopicHit to fetch.
     */
    where?: TopicHitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicHits to fetch.
     */
    orderBy?: TopicHitOrderByWithRelationInput | TopicHitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TopicHits.
     */
    cursor?: TopicHitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicHits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicHits.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TopicHits.
     */
    distinct?: TopicHitScalarFieldEnum | TopicHitScalarFieldEnum[]
  }

  /**
   * TopicHit findMany
   */
  export type TopicHitFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicHit
     */
    select?: TopicHitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicHit
     */
    omit?: TopicHitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicHitInclude<ExtArgs> | null
    /**
     * Filter, which TopicHits to fetch.
     */
    where?: TopicHitWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicHits to fetch.
     */
    orderBy?: TopicHitOrderByWithRelationInput | TopicHitOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TopicHits.
     */
    cursor?: TopicHitWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicHits from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicHits.
     */
    skip?: number
    distinct?: TopicHitScalarFieldEnum | TopicHitScalarFieldEnum[]
  }

  /**
   * TopicHit create
   */
  export type TopicHitCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicHit
     */
    select?: TopicHitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicHit
     */
    omit?: TopicHitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicHitInclude<ExtArgs> | null
    /**
     * The data needed to create a TopicHit.
     */
    data: XOR<TopicHitCreateInput, TopicHitUncheckedCreateInput>
  }

  /**
   * TopicHit createMany
   */
  export type TopicHitCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TopicHits.
     */
    data: TopicHitCreateManyInput | TopicHitCreateManyInput[]
  }

  /**
   * TopicHit createManyAndReturn
   */
  export type TopicHitCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicHit
     */
    select?: TopicHitSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TopicHit
     */
    omit?: TopicHitOmit<ExtArgs> | null
    /**
     * The data used to create many TopicHits.
     */
    data: TopicHitCreateManyInput | TopicHitCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicHitIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TopicHit update
   */
  export type TopicHitUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicHit
     */
    select?: TopicHitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicHit
     */
    omit?: TopicHitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicHitInclude<ExtArgs> | null
    /**
     * The data needed to update a TopicHit.
     */
    data: XOR<TopicHitUpdateInput, TopicHitUncheckedUpdateInput>
    /**
     * Choose, which TopicHit to update.
     */
    where: TopicHitWhereUniqueInput
  }

  /**
   * TopicHit updateMany
   */
  export type TopicHitUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TopicHits.
     */
    data: XOR<TopicHitUpdateManyMutationInput, TopicHitUncheckedUpdateManyInput>
    /**
     * Filter which TopicHits to update
     */
    where?: TopicHitWhereInput
    /**
     * Limit how many TopicHits to update.
     */
    limit?: number
  }

  /**
   * TopicHit updateManyAndReturn
   */
  export type TopicHitUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicHit
     */
    select?: TopicHitSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TopicHit
     */
    omit?: TopicHitOmit<ExtArgs> | null
    /**
     * The data used to update TopicHits.
     */
    data: XOR<TopicHitUpdateManyMutationInput, TopicHitUncheckedUpdateManyInput>
    /**
     * Filter which TopicHits to update
     */
    where?: TopicHitWhereInput
    /**
     * Limit how many TopicHits to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicHitIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TopicHit upsert
   */
  export type TopicHitUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicHit
     */
    select?: TopicHitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicHit
     */
    omit?: TopicHitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicHitInclude<ExtArgs> | null
    /**
     * The filter to search for the TopicHit to update in case it exists.
     */
    where: TopicHitWhereUniqueInput
    /**
     * In case the TopicHit found by the `where` argument doesn't exist, create a new TopicHit with this data.
     */
    create: XOR<TopicHitCreateInput, TopicHitUncheckedCreateInput>
    /**
     * In case the TopicHit was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TopicHitUpdateInput, TopicHitUncheckedUpdateInput>
  }

  /**
   * TopicHit delete
   */
  export type TopicHitDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicHit
     */
    select?: TopicHitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicHit
     */
    omit?: TopicHitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicHitInclude<ExtArgs> | null
    /**
     * Filter which TopicHit to delete.
     */
    where: TopicHitWhereUniqueInput
  }

  /**
   * TopicHit deleteMany
   */
  export type TopicHitDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TopicHits to delete
     */
    where?: TopicHitWhereInput
    /**
     * Limit how many TopicHits to delete.
     */
    limit?: number
  }

  /**
   * TopicHit without action
   */
  export type TopicHitDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicHit
     */
    select?: TopicHitSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicHit
     */
    omit?: TopicHitOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicHitInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PostScalarFieldEnum: {
    id: 'id',
    source: 'source',
    externalId: 'externalId',
    title: 'title',
    url: 'url',
    createdAt: 'createdAt',
    fetchedAt: 'fetchedAt'
  };

  export type PostScalarFieldEnum = (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum]


  export const TopicHitScalarFieldEnum: {
    id: 'id',
    bucketTime: 'bucketTime',
    category: 'category',
    parentKey: 'parentKey',
    parentLabel: 'parentLabel',
    canonicalParentKey: 'canonicalParentKey',
    canonicalParentLabel: 'canonicalParentLabel',
    childKey: 'childKey',
    childLabel: 'childLabel',
    postId: 'postId',
    createdAt: 'createdAt'
  };

  export type TopicHitScalarFieldEnum = (typeof TopicHitScalarFieldEnum)[keyof typeof TopicHitScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type PostWhereInput = {
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    id?: IntFilter<"Post"> | number
    source?: StringFilter<"Post"> | string
    externalId?: StringFilter<"Post"> | string
    title?: StringFilter<"Post"> | string
    url?: StringNullableFilter<"Post"> | string | null
    createdAt?: DateTimeNullableFilter<"Post"> | Date | string | null
    fetchedAt?: DateTimeFilter<"Post"> | Date | string
    topicHits?: TopicHitListRelationFilter
  }

  export type PostOrderByWithRelationInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrder
    title?: SortOrder
    url?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    fetchedAt?: SortOrder
    topicHits?: TopicHitOrderByRelationAggregateInput
  }

  export type PostWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    source_externalId?: PostSourceExternalIdCompoundUniqueInput
    AND?: PostWhereInput | PostWhereInput[]
    OR?: PostWhereInput[]
    NOT?: PostWhereInput | PostWhereInput[]
    source?: StringFilter<"Post"> | string
    externalId?: StringFilter<"Post"> | string
    title?: StringFilter<"Post"> | string
    url?: StringNullableFilter<"Post"> | string | null
    createdAt?: DateTimeNullableFilter<"Post"> | Date | string | null
    fetchedAt?: DateTimeFilter<"Post"> | Date | string
    topicHits?: TopicHitListRelationFilter
  }, "id" | "source_externalId">

  export type PostOrderByWithAggregationInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrder
    title?: SortOrder
    url?: SortOrderInput | SortOrder
    createdAt?: SortOrderInput | SortOrder
    fetchedAt?: SortOrder
    _count?: PostCountOrderByAggregateInput
    _avg?: PostAvgOrderByAggregateInput
    _max?: PostMaxOrderByAggregateInput
    _min?: PostMinOrderByAggregateInput
    _sum?: PostSumOrderByAggregateInput
  }

  export type PostScalarWhereWithAggregatesInput = {
    AND?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    OR?: PostScalarWhereWithAggregatesInput[]
    NOT?: PostScalarWhereWithAggregatesInput | PostScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Post"> | number
    source?: StringWithAggregatesFilter<"Post"> | string
    externalId?: StringWithAggregatesFilter<"Post"> | string
    title?: StringWithAggregatesFilter<"Post"> | string
    url?: StringNullableWithAggregatesFilter<"Post"> | string | null
    createdAt?: DateTimeNullableWithAggregatesFilter<"Post"> | Date | string | null
    fetchedAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
  }

  export type TopicHitWhereInput = {
    AND?: TopicHitWhereInput | TopicHitWhereInput[]
    OR?: TopicHitWhereInput[]
    NOT?: TopicHitWhereInput | TopicHitWhereInput[]
    id?: IntFilter<"TopicHit"> | number
    bucketTime?: DateTimeFilter<"TopicHit"> | Date | string
    category?: StringFilter<"TopicHit"> | string
    parentKey?: StringFilter<"TopicHit"> | string
    parentLabel?: StringFilter<"TopicHit"> | string
    canonicalParentKey?: StringNullableFilter<"TopicHit"> | string | null
    canonicalParentLabel?: StringNullableFilter<"TopicHit"> | string | null
    childKey?: StringNullableFilter<"TopicHit"> | string | null
    childLabel?: StringNullableFilter<"TopicHit"> | string | null
    postId?: IntFilter<"TopicHit"> | number
    createdAt?: DateTimeFilter<"TopicHit"> | Date | string
    post?: XOR<PostScalarRelationFilter, PostWhereInput>
  }

  export type TopicHitOrderByWithRelationInput = {
    id?: SortOrder
    bucketTime?: SortOrder
    category?: SortOrder
    parentKey?: SortOrder
    parentLabel?: SortOrder
    canonicalParentKey?: SortOrderInput | SortOrder
    canonicalParentLabel?: SortOrderInput | SortOrder
    childKey?: SortOrderInput | SortOrder
    childLabel?: SortOrderInput | SortOrder
    postId?: SortOrder
    createdAt?: SortOrder
    post?: PostOrderByWithRelationInput
  }

  export type TopicHitWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    bucketTime_postId?: TopicHitBucketTimePostIdCompoundUniqueInput
    AND?: TopicHitWhereInput | TopicHitWhereInput[]
    OR?: TopicHitWhereInput[]
    NOT?: TopicHitWhereInput | TopicHitWhereInput[]
    bucketTime?: DateTimeFilter<"TopicHit"> | Date | string
    category?: StringFilter<"TopicHit"> | string
    parentKey?: StringFilter<"TopicHit"> | string
    parentLabel?: StringFilter<"TopicHit"> | string
    canonicalParentKey?: StringNullableFilter<"TopicHit"> | string | null
    canonicalParentLabel?: StringNullableFilter<"TopicHit"> | string | null
    childKey?: StringNullableFilter<"TopicHit"> | string | null
    childLabel?: StringNullableFilter<"TopicHit"> | string | null
    postId?: IntFilter<"TopicHit"> | number
    createdAt?: DateTimeFilter<"TopicHit"> | Date | string
    post?: XOR<PostScalarRelationFilter, PostWhereInput>
  }, "id" | "bucketTime_postId">

  export type TopicHitOrderByWithAggregationInput = {
    id?: SortOrder
    bucketTime?: SortOrder
    category?: SortOrder
    parentKey?: SortOrder
    parentLabel?: SortOrder
    canonicalParentKey?: SortOrderInput | SortOrder
    canonicalParentLabel?: SortOrderInput | SortOrder
    childKey?: SortOrderInput | SortOrder
    childLabel?: SortOrderInput | SortOrder
    postId?: SortOrder
    createdAt?: SortOrder
    _count?: TopicHitCountOrderByAggregateInput
    _avg?: TopicHitAvgOrderByAggregateInput
    _max?: TopicHitMaxOrderByAggregateInput
    _min?: TopicHitMinOrderByAggregateInput
    _sum?: TopicHitSumOrderByAggregateInput
  }

  export type TopicHitScalarWhereWithAggregatesInput = {
    AND?: TopicHitScalarWhereWithAggregatesInput | TopicHitScalarWhereWithAggregatesInput[]
    OR?: TopicHitScalarWhereWithAggregatesInput[]
    NOT?: TopicHitScalarWhereWithAggregatesInput | TopicHitScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TopicHit"> | number
    bucketTime?: DateTimeWithAggregatesFilter<"TopicHit"> | Date | string
    category?: StringWithAggregatesFilter<"TopicHit"> | string
    parentKey?: StringWithAggregatesFilter<"TopicHit"> | string
    parentLabel?: StringWithAggregatesFilter<"TopicHit"> | string
    canonicalParentKey?: StringNullableWithAggregatesFilter<"TopicHit"> | string | null
    canonicalParentLabel?: StringNullableWithAggregatesFilter<"TopicHit"> | string | null
    childKey?: StringNullableWithAggregatesFilter<"TopicHit"> | string | null
    childLabel?: StringNullableWithAggregatesFilter<"TopicHit"> | string | null
    postId?: IntWithAggregatesFilter<"TopicHit"> | number
    createdAt?: DateTimeWithAggregatesFilter<"TopicHit"> | Date | string
  }

  export type PostCreateInput = {
    source: string
    externalId: string
    title: string
    url?: string | null
    createdAt?: Date | string | null
    fetchedAt?: Date | string
    topicHits?: TopicHitCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateInput = {
    id?: number
    source: string
    externalId: string
    title: string
    url?: string | null
    createdAt?: Date | string | null
    fetchedAt?: Date | string
    topicHits?: TopicHitUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostUpdateInput = {
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topicHits?: TopicHitUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topicHits?: TopicHitUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostCreateManyInput = {
    id?: number
    source: string
    externalId: string
    title: string
    url?: string | null
    createdAt?: Date | string | null
    fetchedAt?: Date | string
  }

  export type PostUpdateManyMutationInput = {
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicHitCreateInput = {
    bucketTime: Date | string
    category: string
    parentKey: string
    parentLabel: string
    canonicalParentKey?: string | null
    canonicalParentLabel?: string | null
    childKey?: string | null
    childLabel?: string | null
    createdAt?: Date | string
    post: PostCreateNestedOneWithoutTopicHitsInput
  }

  export type TopicHitUncheckedCreateInput = {
    id?: number
    bucketTime: Date | string
    category: string
    parentKey: string
    parentLabel: string
    canonicalParentKey?: string | null
    canonicalParentLabel?: string | null
    childKey?: string | null
    childLabel?: string | null
    postId: number
    createdAt?: Date | string
  }

  export type TopicHitUpdateInput = {
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: StringFieldUpdateOperationsInput | string
    parentKey?: StringFieldUpdateOperationsInput | string
    parentLabel?: StringFieldUpdateOperationsInput | string
    canonicalParentKey?: NullableStringFieldUpdateOperationsInput | string | null
    canonicalParentLabel?: NullableStringFieldUpdateOperationsInput | string | null
    childKey?: NullableStringFieldUpdateOperationsInput | string | null
    childLabel?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    post?: PostUpdateOneRequiredWithoutTopicHitsNestedInput
  }

  export type TopicHitUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: StringFieldUpdateOperationsInput | string
    parentKey?: StringFieldUpdateOperationsInput | string
    parentLabel?: StringFieldUpdateOperationsInput | string
    canonicalParentKey?: NullableStringFieldUpdateOperationsInput | string | null
    canonicalParentLabel?: NullableStringFieldUpdateOperationsInput | string | null
    childKey?: NullableStringFieldUpdateOperationsInput | string | null
    childLabel?: NullableStringFieldUpdateOperationsInput | string | null
    postId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicHitCreateManyInput = {
    id?: number
    bucketTime: Date | string
    category: string
    parentKey: string
    parentLabel: string
    canonicalParentKey?: string | null
    canonicalParentLabel?: string | null
    childKey?: string | null
    childLabel?: string | null
    postId: number
    createdAt?: Date | string
  }

  export type TopicHitUpdateManyMutationInput = {
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: StringFieldUpdateOperationsInput | string
    parentKey?: StringFieldUpdateOperationsInput | string
    parentLabel?: StringFieldUpdateOperationsInput | string
    canonicalParentKey?: NullableStringFieldUpdateOperationsInput | string | null
    canonicalParentLabel?: NullableStringFieldUpdateOperationsInput | string | null
    childKey?: NullableStringFieldUpdateOperationsInput | string | null
    childLabel?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicHitUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: StringFieldUpdateOperationsInput | string
    parentKey?: StringFieldUpdateOperationsInput | string
    parentLabel?: StringFieldUpdateOperationsInput | string
    canonicalParentKey?: NullableStringFieldUpdateOperationsInput | string | null
    canonicalParentLabel?: NullableStringFieldUpdateOperationsInput | string | null
    childKey?: NullableStringFieldUpdateOperationsInput | string | null
    childLabel?: NullableStringFieldUpdateOperationsInput | string | null
    postId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type TopicHitListRelationFilter = {
    every?: TopicHitWhereInput
    some?: TopicHitWhereInput
    none?: TopicHitWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TopicHitOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PostSourceExternalIdCompoundUniqueInput = {
    source: string
    externalId: string
  }

  export type PostCountOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrder
    title?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    fetchedAt?: SortOrder
  }

  export type PostAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type PostMaxOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrder
    title?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    fetchedAt?: SortOrder
  }

  export type PostMinOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrder
    title?: SortOrder
    url?: SortOrder
    createdAt?: SortOrder
    fetchedAt?: SortOrder
  }

  export type PostSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type PostScalarRelationFilter = {
    is?: PostWhereInput
    isNot?: PostWhereInput
  }

  export type TopicHitBucketTimePostIdCompoundUniqueInput = {
    bucketTime: Date | string
    postId: number
  }

  export type TopicHitCountOrderByAggregateInput = {
    id?: SortOrder
    bucketTime?: SortOrder
    category?: SortOrder
    parentKey?: SortOrder
    parentLabel?: SortOrder
    canonicalParentKey?: SortOrder
    canonicalParentLabel?: SortOrder
    childKey?: SortOrder
    childLabel?: SortOrder
    postId?: SortOrder
    createdAt?: SortOrder
  }

  export type TopicHitAvgOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
  }

  export type TopicHitMaxOrderByAggregateInput = {
    id?: SortOrder
    bucketTime?: SortOrder
    category?: SortOrder
    parentKey?: SortOrder
    parentLabel?: SortOrder
    canonicalParentKey?: SortOrder
    canonicalParentLabel?: SortOrder
    childKey?: SortOrder
    childLabel?: SortOrder
    postId?: SortOrder
    createdAt?: SortOrder
  }

  export type TopicHitMinOrderByAggregateInput = {
    id?: SortOrder
    bucketTime?: SortOrder
    category?: SortOrder
    parentKey?: SortOrder
    parentLabel?: SortOrder
    canonicalParentKey?: SortOrder
    canonicalParentLabel?: SortOrder
    childKey?: SortOrder
    childLabel?: SortOrder
    postId?: SortOrder
    createdAt?: SortOrder
  }

  export type TopicHitSumOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
  }

  export type TopicHitCreateNestedManyWithoutPostInput = {
    create?: XOR<TopicHitCreateWithoutPostInput, TopicHitUncheckedCreateWithoutPostInput> | TopicHitCreateWithoutPostInput[] | TopicHitUncheckedCreateWithoutPostInput[]
    connectOrCreate?: TopicHitCreateOrConnectWithoutPostInput | TopicHitCreateOrConnectWithoutPostInput[]
    createMany?: TopicHitCreateManyPostInputEnvelope
    connect?: TopicHitWhereUniqueInput | TopicHitWhereUniqueInput[]
  }

  export type TopicHitUncheckedCreateNestedManyWithoutPostInput = {
    create?: XOR<TopicHitCreateWithoutPostInput, TopicHitUncheckedCreateWithoutPostInput> | TopicHitCreateWithoutPostInput[] | TopicHitUncheckedCreateWithoutPostInput[]
    connectOrCreate?: TopicHitCreateOrConnectWithoutPostInput | TopicHitCreateOrConnectWithoutPostInput[]
    createMany?: TopicHitCreateManyPostInputEnvelope
    connect?: TopicHitWhereUniqueInput | TopicHitWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TopicHitUpdateManyWithoutPostNestedInput = {
    create?: XOR<TopicHitCreateWithoutPostInput, TopicHitUncheckedCreateWithoutPostInput> | TopicHitCreateWithoutPostInput[] | TopicHitUncheckedCreateWithoutPostInput[]
    connectOrCreate?: TopicHitCreateOrConnectWithoutPostInput | TopicHitCreateOrConnectWithoutPostInput[]
    upsert?: TopicHitUpsertWithWhereUniqueWithoutPostInput | TopicHitUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: TopicHitCreateManyPostInputEnvelope
    set?: TopicHitWhereUniqueInput | TopicHitWhereUniqueInput[]
    disconnect?: TopicHitWhereUniqueInput | TopicHitWhereUniqueInput[]
    delete?: TopicHitWhereUniqueInput | TopicHitWhereUniqueInput[]
    connect?: TopicHitWhereUniqueInput | TopicHitWhereUniqueInput[]
    update?: TopicHitUpdateWithWhereUniqueWithoutPostInput | TopicHitUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: TopicHitUpdateManyWithWhereWithoutPostInput | TopicHitUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: TopicHitScalarWhereInput | TopicHitScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TopicHitUncheckedUpdateManyWithoutPostNestedInput = {
    create?: XOR<TopicHitCreateWithoutPostInput, TopicHitUncheckedCreateWithoutPostInput> | TopicHitCreateWithoutPostInput[] | TopicHitUncheckedCreateWithoutPostInput[]
    connectOrCreate?: TopicHitCreateOrConnectWithoutPostInput | TopicHitCreateOrConnectWithoutPostInput[]
    upsert?: TopicHitUpsertWithWhereUniqueWithoutPostInput | TopicHitUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: TopicHitCreateManyPostInputEnvelope
    set?: TopicHitWhereUniqueInput | TopicHitWhereUniqueInput[]
    disconnect?: TopicHitWhereUniqueInput | TopicHitWhereUniqueInput[]
    delete?: TopicHitWhereUniqueInput | TopicHitWhereUniqueInput[]
    connect?: TopicHitWhereUniqueInput | TopicHitWhereUniqueInput[]
    update?: TopicHitUpdateWithWhereUniqueWithoutPostInput | TopicHitUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: TopicHitUpdateManyWithWhereWithoutPostInput | TopicHitUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: TopicHitScalarWhereInput | TopicHitScalarWhereInput[]
  }

  export type PostCreateNestedOneWithoutTopicHitsInput = {
    create?: XOR<PostCreateWithoutTopicHitsInput, PostUncheckedCreateWithoutTopicHitsInput>
    connectOrCreate?: PostCreateOrConnectWithoutTopicHitsInput
    connect?: PostWhereUniqueInput
  }

  export type PostUpdateOneRequiredWithoutTopicHitsNestedInput = {
    create?: XOR<PostCreateWithoutTopicHitsInput, PostUncheckedCreateWithoutTopicHitsInput>
    connectOrCreate?: PostCreateOrConnectWithoutTopicHitsInput
    upsert?: PostUpsertWithoutTopicHitsInput
    connect?: PostWhereUniqueInput
    update?: XOR<XOR<PostUpdateToOneWithWhereWithoutTopicHitsInput, PostUpdateWithoutTopicHitsInput>, PostUncheckedUpdateWithoutTopicHitsInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type TopicHitCreateWithoutPostInput = {
    bucketTime: Date | string
    category: string
    parentKey: string
    parentLabel: string
    canonicalParentKey?: string | null
    canonicalParentLabel?: string | null
    childKey?: string | null
    childLabel?: string | null
    createdAt?: Date | string
  }

  export type TopicHitUncheckedCreateWithoutPostInput = {
    id?: number
    bucketTime: Date | string
    category: string
    parentKey: string
    parentLabel: string
    canonicalParentKey?: string | null
    canonicalParentLabel?: string | null
    childKey?: string | null
    childLabel?: string | null
    createdAt?: Date | string
  }

  export type TopicHitCreateOrConnectWithoutPostInput = {
    where: TopicHitWhereUniqueInput
    create: XOR<TopicHitCreateWithoutPostInput, TopicHitUncheckedCreateWithoutPostInput>
  }

  export type TopicHitCreateManyPostInputEnvelope = {
    data: TopicHitCreateManyPostInput | TopicHitCreateManyPostInput[]
  }

  export type TopicHitUpsertWithWhereUniqueWithoutPostInput = {
    where: TopicHitWhereUniqueInput
    update: XOR<TopicHitUpdateWithoutPostInput, TopicHitUncheckedUpdateWithoutPostInput>
    create: XOR<TopicHitCreateWithoutPostInput, TopicHitUncheckedCreateWithoutPostInput>
  }

  export type TopicHitUpdateWithWhereUniqueWithoutPostInput = {
    where: TopicHitWhereUniqueInput
    data: XOR<TopicHitUpdateWithoutPostInput, TopicHitUncheckedUpdateWithoutPostInput>
  }

  export type TopicHitUpdateManyWithWhereWithoutPostInput = {
    where: TopicHitScalarWhereInput
    data: XOR<TopicHitUpdateManyMutationInput, TopicHitUncheckedUpdateManyWithoutPostInput>
  }

  export type TopicHitScalarWhereInput = {
    AND?: TopicHitScalarWhereInput | TopicHitScalarWhereInput[]
    OR?: TopicHitScalarWhereInput[]
    NOT?: TopicHitScalarWhereInput | TopicHitScalarWhereInput[]
    id?: IntFilter<"TopicHit"> | number
    bucketTime?: DateTimeFilter<"TopicHit"> | Date | string
    category?: StringFilter<"TopicHit"> | string
    parentKey?: StringFilter<"TopicHit"> | string
    parentLabel?: StringFilter<"TopicHit"> | string
    canonicalParentKey?: StringNullableFilter<"TopicHit"> | string | null
    canonicalParentLabel?: StringNullableFilter<"TopicHit"> | string | null
    childKey?: StringNullableFilter<"TopicHit"> | string | null
    childLabel?: StringNullableFilter<"TopicHit"> | string | null
    postId?: IntFilter<"TopicHit"> | number
    createdAt?: DateTimeFilter<"TopicHit"> | Date | string
  }

  export type PostCreateWithoutTopicHitsInput = {
    source: string
    externalId: string
    title: string
    url?: string | null
    createdAt?: Date | string | null
    fetchedAt?: Date | string
  }

  export type PostUncheckedCreateWithoutTopicHitsInput = {
    id?: number
    source: string
    externalId: string
    title: string
    url?: string | null
    createdAt?: Date | string | null
    fetchedAt?: Date | string
  }

  export type PostCreateOrConnectWithoutTopicHitsInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutTopicHitsInput, PostUncheckedCreateWithoutTopicHitsInput>
  }

  export type PostUpsertWithoutTopicHitsInput = {
    update: XOR<PostUpdateWithoutTopicHitsInput, PostUncheckedUpdateWithoutTopicHitsInput>
    create: XOR<PostCreateWithoutTopicHitsInput, PostUncheckedCreateWithoutTopicHitsInput>
    where?: PostWhereInput
  }

  export type PostUpdateToOneWithWhereWithoutTopicHitsInput = {
    where?: PostWhereInput
    data: XOR<PostUpdateWithoutTopicHitsInput, PostUncheckedUpdateWithoutTopicHitsInput>
  }

  export type PostUpdateWithoutTopicHitsInput = {
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateWithoutTopicHitsInput = {
    id?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicHitCreateManyPostInput = {
    id?: number
    bucketTime: Date | string
    category: string
    parentKey: string
    parentLabel: string
    canonicalParentKey?: string | null
    canonicalParentLabel?: string | null
    childKey?: string | null
    childLabel?: string | null
    createdAt?: Date | string
  }

  export type TopicHitUpdateWithoutPostInput = {
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: StringFieldUpdateOperationsInput | string
    parentKey?: StringFieldUpdateOperationsInput | string
    parentLabel?: StringFieldUpdateOperationsInput | string
    canonicalParentKey?: NullableStringFieldUpdateOperationsInput | string | null
    canonicalParentLabel?: NullableStringFieldUpdateOperationsInput | string | null
    childKey?: NullableStringFieldUpdateOperationsInput | string | null
    childLabel?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicHitUncheckedUpdateWithoutPostInput = {
    id?: IntFieldUpdateOperationsInput | number
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: StringFieldUpdateOperationsInput | string
    parentKey?: StringFieldUpdateOperationsInput | string
    parentLabel?: StringFieldUpdateOperationsInput | string
    canonicalParentKey?: NullableStringFieldUpdateOperationsInput | string | null
    canonicalParentLabel?: NullableStringFieldUpdateOperationsInput | string | null
    childKey?: NullableStringFieldUpdateOperationsInput | string | null
    childLabel?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicHitUncheckedUpdateManyWithoutPostInput = {
    id?: IntFieldUpdateOperationsInput | number
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
    category?: StringFieldUpdateOperationsInput | string
    parentKey?: StringFieldUpdateOperationsInput | string
    parentLabel?: StringFieldUpdateOperationsInput | string
    canonicalParentKey?: NullableStringFieldUpdateOperationsInput | string | null
    canonicalParentLabel?: NullableStringFieldUpdateOperationsInput | string | null
    childKey?: NullableStringFieldUpdateOperationsInput | string | null
    childLabel?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}