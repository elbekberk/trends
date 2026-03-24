
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
 * Model TopicCount
 * 
 */
export type TopicCount = $Result.DefaultSelection<Prisma.$TopicCountPayload>
/**
 * Model TopicEvidence
 * 
 */
export type TopicEvidence = $Result.DefaultSelection<Prisma.$TopicEvidencePayload>

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
   * `prisma.topicCount`: Exposes CRUD operations for the **TopicCount** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TopicCounts
    * const topicCounts = await prisma.topicCount.findMany()
    * ```
    */
  get topicCount(): Prisma.TopicCountDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.topicEvidence`: Exposes CRUD operations for the **TopicEvidence** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TopicEvidences
    * const topicEvidences = await prisma.topicEvidence.findMany()
    * ```
    */
  get topicEvidence(): Prisma.TopicEvidenceDelegate<ExtArgs, ClientOptions>;
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
    TopicCount: 'TopicCount',
    TopicEvidence: 'TopicEvidence'
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
      modelProps: "post" | "topicCount" | "topicEvidence"
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
      TopicCount: {
        payload: Prisma.$TopicCountPayload<ExtArgs>
        fields: Prisma.TopicCountFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TopicCountFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicCountPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TopicCountFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicCountPayload>
          }
          findFirst: {
            args: Prisma.TopicCountFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicCountPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TopicCountFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicCountPayload>
          }
          findMany: {
            args: Prisma.TopicCountFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicCountPayload>[]
          }
          create: {
            args: Prisma.TopicCountCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicCountPayload>
          }
          createMany: {
            args: Prisma.TopicCountCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TopicCountCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicCountPayload>[]
          }
          delete: {
            args: Prisma.TopicCountDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicCountPayload>
          }
          update: {
            args: Prisma.TopicCountUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicCountPayload>
          }
          deleteMany: {
            args: Prisma.TopicCountDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TopicCountUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TopicCountUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicCountPayload>[]
          }
          upsert: {
            args: Prisma.TopicCountUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicCountPayload>
          }
          aggregate: {
            args: Prisma.TopicCountAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTopicCount>
          }
          groupBy: {
            args: Prisma.TopicCountGroupByArgs<ExtArgs>
            result: $Utils.Optional<TopicCountGroupByOutputType>[]
          }
          count: {
            args: Prisma.TopicCountCountArgs<ExtArgs>
            result: $Utils.Optional<TopicCountCountAggregateOutputType> | number
          }
        }
      }
      TopicEvidence: {
        payload: Prisma.$TopicEvidencePayload<ExtArgs>
        fields: Prisma.TopicEvidenceFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TopicEvidenceFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicEvidencePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TopicEvidenceFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicEvidencePayload>
          }
          findFirst: {
            args: Prisma.TopicEvidenceFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicEvidencePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TopicEvidenceFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicEvidencePayload>
          }
          findMany: {
            args: Prisma.TopicEvidenceFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicEvidencePayload>[]
          }
          create: {
            args: Prisma.TopicEvidenceCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicEvidencePayload>
          }
          createMany: {
            args: Prisma.TopicEvidenceCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TopicEvidenceCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicEvidencePayload>[]
          }
          delete: {
            args: Prisma.TopicEvidenceDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicEvidencePayload>
          }
          update: {
            args: Prisma.TopicEvidenceUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicEvidencePayload>
          }
          deleteMany: {
            args: Prisma.TopicEvidenceDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TopicEvidenceUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TopicEvidenceUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicEvidencePayload>[]
          }
          upsert: {
            args: Prisma.TopicEvidenceUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicEvidencePayload>
          }
          aggregate: {
            args: Prisma.TopicEvidenceAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTopicEvidence>
          }
          groupBy: {
            args: Prisma.TopicEvidenceGroupByArgs<ExtArgs>
            result: $Utils.Optional<TopicEvidenceGroupByOutputType>[]
          }
          count: {
            args: Prisma.TopicEvidenceCountArgs<ExtArgs>
            result: $Utils.Optional<TopicEvidenceCountAggregateOutputType> | number
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
    topicCount?: TopicCountOmit
    topicEvidence?: TopicEvidenceOmit
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
    evidences: number
  }

  export type PostCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    evidences?: boolean | PostCountOutputTypeCountEvidencesArgs
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
  export type PostCountOutputTypeCountEvidencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicEvidenceWhereInput
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
    createdAt: Date | null
    fetchedAt: Date | null
  }

  export type PostMaxAggregateOutputType = {
    id: number | null
    source: string | null
    externalId: string | null
    title: string | null
    createdAt: Date | null
    fetchedAt: Date | null
  }

  export type PostCountAggregateOutputType = {
    id: number
    source: number
    externalId: number
    title: number
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
    createdAt?: true
    fetchedAt?: true
  }

  export type PostMaxAggregateInputType = {
    id?: true
    source?: true
    externalId?: true
    title?: true
    createdAt?: true
    fetchedAt?: true
  }

  export type PostCountAggregateInputType = {
    id?: true
    source?: true
    externalId?: true
    title?: true
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
    createdAt?: boolean
    fetchedAt?: boolean
    evidences?: boolean | Post$evidencesArgs<ExtArgs>
    _count?: boolean | PostCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["post"]>

  export type PostSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source?: boolean
    externalId?: boolean
    title?: boolean
    createdAt?: boolean
    fetchedAt?: boolean
  }, ExtArgs["result"]["post"]>

  export type PostSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    source?: boolean
    externalId?: boolean
    title?: boolean
    createdAt?: boolean
    fetchedAt?: boolean
  }, ExtArgs["result"]["post"]>

  export type PostSelectScalar = {
    id?: boolean
    source?: boolean
    externalId?: boolean
    title?: boolean
    createdAt?: boolean
    fetchedAt?: boolean
  }

  export type PostOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "source" | "externalId" | "title" | "createdAt" | "fetchedAt", ExtArgs["result"]["post"]>
  export type PostInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    evidences?: boolean | Post$evidencesArgs<ExtArgs>
    _count?: boolean | PostCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PostIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type PostIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $PostPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Post"
    objects: {
      evidences: Prisma.$TopicEvidencePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      source: string
      externalId: string
      title: string
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
    evidences<T extends Post$evidencesArgs<ExtArgs> = {}>(args?: Subset<T, Post$evidencesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicEvidencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Post.evidences
   */
  export type Post$evidencesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicEvidence
     */
    select?: TopicEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicEvidence
     */
    omit?: TopicEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicEvidenceInclude<ExtArgs> | null
    where?: TopicEvidenceWhereInput
    orderBy?: TopicEvidenceOrderByWithRelationInput | TopicEvidenceOrderByWithRelationInput[]
    cursor?: TopicEvidenceWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TopicEvidenceScalarFieldEnum | TopicEvidenceScalarFieldEnum[]
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
   * Model TopicCount
   */

  export type AggregateTopicCount = {
    _count: TopicCountCountAggregateOutputType | null
    _avg: TopicCountAvgAggregateOutputType | null
    _sum: TopicCountSumAggregateOutputType | null
    _min: TopicCountMinAggregateOutputType | null
    _max: TopicCountMaxAggregateOutputType | null
  }

  export type TopicCountAvgAggregateOutputType = {
    id: number | null
    count: number | null
  }

  export type TopicCountSumAggregateOutputType = {
    id: number | null
    count: number | null
  }

  export type TopicCountMinAggregateOutputType = {
    id: number | null
    topic: string | null
    topicLabel: string | null
    bucketTime: Date | null
    count: number | null
  }

  export type TopicCountMaxAggregateOutputType = {
    id: number | null
    topic: string | null
    topicLabel: string | null
    bucketTime: Date | null
    count: number | null
  }

  export type TopicCountCountAggregateOutputType = {
    id: number
    topic: number
    topicLabel: number
    bucketTime: number
    count: number
    _all: number
  }


  export type TopicCountAvgAggregateInputType = {
    id?: true
    count?: true
  }

  export type TopicCountSumAggregateInputType = {
    id?: true
    count?: true
  }

  export type TopicCountMinAggregateInputType = {
    id?: true
    topic?: true
    topicLabel?: true
    bucketTime?: true
    count?: true
  }

  export type TopicCountMaxAggregateInputType = {
    id?: true
    topic?: true
    topicLabel?: true
    bucketTime?: true
    count?: true
  }

  export type TopicCountCountAggregateInputType = {
    id?: true
    topic?: true
    topicLabel?: true
    bucketTime?: true
    count?: true
    _all?: true
  }

  export type TopicCountAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TopicCount to aggregate.
     */
    where?: TopicCountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicCounts to fetch.
     */
    orderBy?: TopicCountOrderByWithRelationInput | TopicCountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TopicCountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicCounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicCounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TopicCounts
    **/
    _count?: true | TopicCountCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TopicCountAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TopicCountSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TopicCountMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TopicCountMaxAggregateInputType
  }

  export type GetTopicCountAggregateType<T extends TopicCountAggregateArgs> = {
        [P in keyof T & keyof AggregateTopicCount]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTopicCount[P]>
      : GetScalarType<T[P], AggregateTopicCount[P]>
  }




  export type TopicCountGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicCountWhereInput
    orderBy?: TopicCountOrderByWithAggregationInput | TopicCountOrderByWithAggregationInput[]
    by: TopicCountScalarFieldEnum[] | TopicCountScalarFieldEnum
    having?: TopicCountScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TopicCountCountAggregateInputType | true
    _avg?: TopicCountAvgAggregateInputType
    _sum?: TopicCountSumAggregateInputType
    _min?: TopicCountMinAggregateInputType
    _max?: TopicCountMaxAggregateInputType
  }

  export type TopicCountGroupByOutputType = {
    id: number
    topic: string
    topicLabel: string
    bucketTime: Date
    count: number
    _count: TopicCountCountAggregateOutputType | null
    _avg: TopicCountAvgAggregateOutputType | null
    _sum: TopicCountSumAggregateOutputType | null
    _min: TopicCountMinAggregateOutputType | null
    _max: TopicCountMaxAggregateOutputType | null
  }

  type GetTopicCountGroupByPayload<T extends TopicCountGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TopicCountGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TopicCountGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TopicCountGroupByOutputType[P]>
            : GetScalarType<T[P], TopicCountGroupByOutputType[P]>
        }
      >
    >


  export type TopicCountSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    topic?: boolean
    topicLabel?: boolean
    bucketTime?: boolean
    count?: boolean
  }, ExtArgs["result"]["topicCount"]>

  export type TopicCountSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    topic?: boolean
    topicLabel?: boolean
    bucketTime?: boolean
    count?: boolean
  }, ExtArgs["result"]["topicCount"]>

  export type TopicCountSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    topic?: boolean
    topicLabel?: boolean
    bucketTime?: boolean
    count?: boolean
  }, ExtArgs["result"]["topicCount"]>

  export type TopicCountSelectScalar = {
    id?: boolean
    topic?: boolean
    topicLabel?: boolean
    bucketTime?: boolean
    count?: boolean
  }

  export type TopicCountOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "topic" | "topicLabel" | "bucketTime" | "count", ExtArgs["result"]["topicCount"]>

  export type $TopicCountPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TopicCount"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      topic: string
      topicLabel: string
      bucketTime: Date
      count: number
    }, ExtArgs["result"]["topicCount"]>
    composites: {}
  }

  type TopicCountGetPayload<S extends boolean | null | undefined | TopicCountDefaultArgs> = $Result.GetResult<Prisma.$TopicCountPayload, S>

  type TopicCountCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TopicCountFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TopicCountCountAggregateInputType | true
    }

  export interface TopicCountDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TopicCount'], meta: { name: 'TopicCount' } }
    /**
     * Find zero or one TopicCount that matches the filter.
     * @param {TopicCountFindUniqueArgs} args - Arguments to find a TopicCount
     * @example
     * // Get one TopicCount
     * const topicCount = await prisma.topicCount.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TopicCountFindUniqueArgs>(args: SelectSubset<T, TopicCountFindUniqueArgs<ExtArgs>>): Prisma__TopicCountClient<$Result.GetResult<Prisma.$TopicCountPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TopicCount that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TopicCountFindUniqueOrThrowArgs} args - Arguments to find a TopicCount
     * @example
     * // Get one TopicCount
     * const topicCount = await prisma.topicCount.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TopicCountFindUniqueOrThrowArgs>(args: SelectSubset<T, TopicCountFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TopicCountClient<$Result.GetResult<Prisma.$TopicCountPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TopicCount that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicCountFindFirstArgs} args - Arguments to find a TopicCount
     * @example
     * // Get one TopicCount
     * const topicCount = await prisma.topicCount.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TopicCountFindFirstArgs>(args?: SelectSubset<T, TopicCountFindFirstArgs<ExtArgs>>): Prisma__TopicCountClient<$Result.GetResult<Prisma.$TopicCountPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TopicCount that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicCountFindFirstOrThrowArgs} args - Arguments to find a TopicCount
     * @example
     * // Get one TopicCount
     * const topicCount = await prisma.topicCount.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TopicCountFindFirstOrThrowArgs>(args?: SelectSubset<T, TopicCountFindFirstOrThrowArgs<ExtArgs>>): Prisma__TopicCountClient<$Result.GetResult<Prisma.$TopicCountPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TopicCounts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicCountFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TopicCounts
     * const topicCounts = await prisma.topicCount.findMany()
     * 
     * // Get first 10 TopicCounts
     * const topicCounts = await prisma.topicCount.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const topicCountWithIdOnly = await prisma.topicCount.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TopicCountFindManyArgs>(args?: SelectSubset<T, TopicCountFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicCountPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TopicCount.
     * @param {TopicCountCreateArgs} args - Arguments to create a TopicCount.
     * @example
     * // Create one TopicCount
     * const TopicCount = await prisma.topicCount.create({
     *   data: {
     *     // ... data to create a TopicCount
     *   }
     * })
     * 
     */
    create<T extends TopicCountCreateArgs>(args: SelectSubset<T, TopicCountCreateArgs<ExtArgs>>): Prisma__TopicCountClient<$Result.GetResult<Prisma.$TopicCountPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TopicCounts.
     * @param {TopicCountCreateManyArgs} args - Arguments to create many TopicCounts.
     * @example
     * // Create many TopicCounts
     * const topicCount = await prisma.topicCount.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TopicCountCreateManyArgs>(args?: SelectSubset<T, TopicCountCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TopicCounts and returns the data saved in the database.
     * @param {TopicCountCreateManyAndReturnArgs} args - Arguments to create many TopicCounts.
     * @example
     * // Create many TopicCounts
     * const topicCount = await prisma.topicCount.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TopicCounts and only return the `id`
     * const topicCountWithIdOnly = await prisma.topicCount.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TopicCountCreateManyAndReturnArgs>(args?: SelectSubset<T, TopicCountCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicCountPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TopicCount.
     * @param {TopicCountDeleteArgs} args - Arguments to delete one TopicCount.
     * @example
     * // Delete one TopicCount
     * const TopicCount = await prisma.topicCount.delete({
     *   where: {
     *     // ... filter to delete one TopicCount
     *   }
     * })
     * 
     */
    delete<T extends TopicCountDeleteArgs>(args: SelectSubset<T, TopicCountDeleteArgs<ExtArgs>>): Prisma__TopicCountClient<$Result.GetResult<Prisma.$TopicCountPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TopicCount.
     * @param {TopicCountUpdateArgs} args - Arguments to update one TopicCount.
     * @example
     * // Update one TopicCount
     * const topicCount = await prisma.topicCount.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TopicCountUpdateArgs>(args: SelectSubset<T, TopicCountUpdateArgs<ExtArgs>>): Prisma__TopicCountClient<$Result.GetResult<Prisma.$TopicCountPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TopicCounts.
     * @param {TopicCountDeleteManyArgs} args - Arguments to filter TopicCounts to delete.
     * @example
     * // Delete a few TopicCounts
     * const { count } = await prisma.topicCount.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TopicCountDeleteManyArgs>(args?: SelectSubset<T, TopicCountDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TopicCounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicCountUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TopicCounts
     * const topicCount = await prisma.topicCount.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TopicCountUpdateManyArgs>(args: SelectSubset<T, TopicCountUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TopicCounts and returns the data updated in the database.
     * @param {TopicCountUpdateManyAndReturnArgs} args - Arguments to update many TopicCounts.
     * @example
     * // Update many TopicCounts
     * const topicCount = await prisma.topicCount.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TopicCounts and only return the `id`
     * const topicCountWithIdOnly = await prisma.topicCount.updateManyAndReturn({
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
    updateManyAndReturn<T extends TopicCountUpdateManyAndReturnArgs>(args: SelectSubset<T, TopicCountUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicCountPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TopicCount.
     * @param {TopicCountUpsertArgs} args - Arguments to update or create a TopicCount.
     * @example
     * // Update or create a TopicCount
     * const topicCount = await prisma.topicCount.upsert({
     *   create: {
     *     // ... data to create a TopicCount
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TopicCount we want to update
     *   }
     * })
     */
    upsert<T extends TopicCountUpsertArgs>(args: SelectSubset<T, TopicCountUpsertArgs<ExtArgs>>): Prisma__TopicCountClient<$Result.GetResult<Prisma.$TopicCountPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TopicCounts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicCountCountArgs} args - Arguments to filter TopicCounts to count.
     * @example
     * // Count the number of TopicCounts
     * const count = await prisma.topicCount.count({
     *   where: {
     *     // ... the filter for the TopicCounts we want to count
     *   }
     * })
    **/
    count<T extends TopicCountCountArgs>(
      args?: Subset<T, TopicCountCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TopicCountCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TopicCount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicCountAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TopicCountAggregateArgs>(args: Subset<T, TopicCountAggregateArgs>): Prisma.PrismaPromise<GetTopicCountAggregateType<T>>

    /**
     * Group by TopicCount.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicCountGroupByArgs} args - Group by arguments.
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
      T extends TopicCountGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TopicCountGroupByArgs['orderBy'] }
        : { orderBy?: TopicCountGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TopicCountGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTopicCountGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TopicCount model
   */
  readonly fields: TopicCountFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TopicCount.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TopicCountClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
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
   * Fields of the TopicCount model
   */
  interface TopicCountFieldRefs {
    readonly id: FieldRef<"TopicCount", 'Int'>
    readonly topic: FieldRef<"TopicCount", 'String'>
    readonly topicLabel: FieldRef<"TopicCount", 'String'>
    readonly bucketTime: FieldRef<"TopicCount", 'DateTime'>
    readonly count: FieldRef<"TopicCount", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * TopicCount findUnique
   */
  export type TopicCountFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicCount
     */
    select?: TopicCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicCount
     */
    omit?: TopicCountOmit<ExtArgs> | null
    /**
     * Filter, which TopicCount to fetch.
     */
    where: TopicCountWhereUniqueInput
  }

  /**
   * TopicCount findUniqueOrThrow
   */
  export type TopicCountFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicCount
     */
    select?: TopicCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicCount
     */
    omit?: TopicCountOmit<ExtArgs> | null
    /**
     * Filter, which TopicCount to fetch.
     */
    where: TopicCountWhereUniqueInput
  }

  /**
   * TopicCount findFirst
   */
  export type TopicCountFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicCount
     */
    select?: TopicCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicCount
     */
    omit?: TopicCountOmit<ExtArgs> | null
    /**
     * Filter, which TopicCount to fetch.
     */
    where?: TopicCountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicCounts to fetch.
     */
    orderBy?: TopicCountOrderByWithRelationInput | TopicCountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TopicCounts.
     */
    cursor?: TopicCountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicCounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicCounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TopicCounts.
     */
    distinct?: TopicCountScalarFieldEnum | TopicCountScalarFieldEnum[]
  }

  /**
   * TopicCount findFirstOrThrow
   */
  export type TopicCountFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicCount
     */
    select?: TopicCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicCount
     */
    omit?: TopicCountOmit<ExtArgs> | null
    /**
     * Filter, which TopicCount to fetch.
     */
    where?: TopicCountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicCounts to fetch.
     */
    orderBy?: TopicCountOrderByWithRelationInput | TopicCountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TopicCounts.
     */
    cursor?: TopicCountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicCounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicCounts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TopicCounts.
     */
    distinct?: TopicCountScalarFieldEnum | TopicCountScalarFieldEnum[]
  }

  /**
   * TopicCount findMany
   */
  export type TopicCountFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicCount
     */
    select?: TopicCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicCount
     */
    omit?: TopicCountOmit<ExtArgs> | null
    /**
     * Filter, which TopicCounts to fetch.
     */
    where?: TopicCountWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicCounts to fetch.
     */
    orderBy?: TopicCountOrderByWithRelationInput | TopicCountOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TopicCounts.
     */
    cursor?: TopicCountWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicCounts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicCounts.
     */
    skip?: number
    distinct?: TopicCountScalarFieldEnum | TopicCountScalarFieldEnum[]
  }

  /**
   * TopicCount create
   */
  export type TopicCountCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicCount
     */
    select?: TopicCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicCount
     */
    omit?: TopicCountOmit<ExtArgs> | null
    /**
     * The data needed to create a TopicCount.
     */
    data: XOR<TopicCountCreateInput, TopicCountUncheckedCreateInput>
  }

  /**
   * TopicCount createMany
   */
  export type TopicCountCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TopicCounts.
     */
    data: TopicCountCreateManyInput | TopicCountCreateManyInput[]
  }

  /**
   * TopicCount createManyAndReturn
   */
  export type TopicCountCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicCount
     */
    select?: TopicCountSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TopicCount
     */
    omit?: TopicCountOmit<ExtArgs> | null
    /**
     * The data used to create many TopicCounts.
     */
    data: TopicCountCreateManyInput | TopicCountCreateManyInput[]
  }

  /**
   * TopicCount update
   */
  export type TopicCountUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicCount
     */
    select?: TopicCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicCount
     */
    omit?: TopicCountOmit<ExtArgs> | null
    /**
     * The data needed to update a TopicCount.
     */
    data: XOR<TopicCountUpdateInput, TopicCountUncheckedUpdateInput>
    /**
     * Choose, which TopicCount to update.
     */
    where: TopicCountWhereUniqueInput
  }

  /**
   * TopicCount updateMany
   */
  export type TopicCountUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TopicCounts.
     */
    data: XOR<TopicCountUpdateManyMutationInput, TopicCountUncheckedUpdateManyInput>
    /**
     * Filter which TopicCounts to update
     */
    where?: TopicCountWhereInput
    /**
     * Limit how many TopicCounts to update.
     */
    limit?: number
  }

  /**
   * TopicCount updateManyAndReturn
   */
  export type TopicCountUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicCount
     */
    select?: TopicCountSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TopicCount
     */
    omit?: TopicCountOmit<ExtArgs> | null
    /**
     * The data used to update TopicCounts.
     */
    data: XOR<TopicCountUpdateManyMutationInput, TopicCountUncheckedUpdateManyInput>
    /**
     * Filter which TopicCounts to update
     */
    where?: TopicCountWhereInput
    /**
     * Limit how many TopicCounts to update.
     */
    limit?: number
  }

  /**
   * TopicCount upsert
   */
  export type TopicCountUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicCount
     */
    select?: TopicCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicCount
     */
    omit?: TopicCountOmit<ExtArgs> | null
    /**
     * The filter to search for the TopicCount to update in case it exists.
     */
    where: TopicCountWhereUniqueInput
    /**
     * In case the TopicCount found by the `where` argument doesn't exist, create a new TopicCount with this data.
     */
    create: XOR<TopicCountCreateInput, TopicCountUncheckedCreateInput>
    /**
     * In case the TopicCount was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TopicCountUpdateInput, TopicCountUncheckedUpdateInput>
  }

  /**
   * TopicCount delete
   */
  export type TopicCountDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicCount
     */
    select?: TopicCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicCount
     */
    omit?: TopicCountOmit<ExtArgs> | null
    /**
     * Filter which TopicCount to delete.
     */
    where: TopicCountWhereUniqueInput
  }

  /**
   * TopicCount deleteMany
   */
  export type TopicCountDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TopicCounts to delete
     */
    where?: TopicCountWhereInput
    /**
     * Limit how many TopicCounts to delete.
     */
    limit?: number
  }

  /**
   * TopicCount without action
   */
  export type TopicCountDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicCount
     */
    select?: TopicCountSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicCount
     */
    omit?: TopicCountOmit<ExtArgs> | null
  }


  /**
   * Model TopicEvidence
   */

  export type AggregateTopicEvidence = {
    _count: TopicEvidenceCountAggregateOutputType | null
    _avg: TopicEvidenceAvgAggregateOutputType | null
    _sum: TopicEvidenceSumAggregateOutputType | null
    _min: TopicEvidenceMinAggregateOutputType | null
    _max: TopicEvidenceMaxAggregateOutputType | null
  }

  export type TopicEvidenceAvgAggregateOutputType = {
    id: number | null
    postId: number | null
  }

  export type TopicEvidenceSumAggregateOutputType = {
    id: number | null
    postId: number | null
  }

  export type TopicEvidenceMinAggregateOutputType = {
    id: number | null
    topic: string | null
    bucketTime: Date | null
    postId: number | null
    createdAt: Date | null
  }

  export type TopicEvidenceMaxAggregateOutputType = {
    id: number | null
    topic: string | null
    bucketTime: Date | null
    postId: number | null
    createdAt: Date | null
  }

  export type TopicEvidenceCountAggregateOutputType = {
    id: number
    topic: number
    bucketTime: number
    postId: number
    createdAt: number
    _all: number
  }


  export type TopicEvidenceAvgAggregateInputType = {
    id?: true
    postId?: true
  }

  export type TopicEvidenceSumAggregateInputType = {
    id?: true
    postId?: true
  }

  export type TopicEvidenceMinAggregateInputType = {
    id?: true
    topic?: true
    bucketTime?: true
    postId?: true
    createdAt?: true
  }

  export type TopicEvidenceMaxAggregateInputType = {
    id?: true
    topic?: true
    bucketTime?: true
    postId?: true
    createdAt?: true
  }

  export type TopicEvidenceCountAggregateInputType = {
    id?: true
    topic?: true
    bucketTime?: true
    postId?: true
    createdAt?: true
    _all?: true
  }

  export type TopicEvidenceAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TopicEvidence to aggregate.
     */
    where?: TopicEvidenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicEvidences to fetch.
     */
    orderBy?: TopicEvidenceOrderByWithRelationInput | TopicEvidenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TopicEvidenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicEvidences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicEvidences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TopicEvidences
    **/
    _count?: true | TopicEvidenceCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TopicEvidenceAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TopicEvidenceSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TopicEvidenceMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TopicEvidenceMaxAggregateInputType
  }

  export type GetTopicEvidenceAggregateType<T extends TopicEvidenceAggregateArgs> = {
        [P in keyof T & keyof AggregateTopicEvidence]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTopicEvidence[P]>
      : GetScalarType<T[P], AggregateTopicEvidence[P]>
  }




  export type TopicEvidenceGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicEvidenceWhereInput
    orderBy?: TopicEvidenceOrderByWithAggregationInput | TopicEvidenceOrderByWithAggregationInput[]
    by: TopicEvidenceScalarFieldEnum[] | TopicEvidenceScalarFieldEnum
    having?: TopicEvidenceScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TopicEvidenceCountAggregateInputType | true
    _avg?: TopicEvidenceAvgAggregateInputType
    _sum?: TopicEvidenceSumAggregateInputType
    _min?: TopicEvidenceMinAggregateInputType
    _max?: TopicEvidenceMaxAggregateInputType
  }

  export type TopicEvidenceGroupByOutputType = {
    id: number
    topic: string
    bucketTime: Date
    postId: number
    createdAt: Date
    _count: TopicEvidenceCountAggregateOutputType | null
    _avg: TopicEvidenceAvgAggregateOutputType | null
    _sum: TopicEvidenceSumAggregateOutputType | null
    _min: TopicEvidenceMinAggregateOutputType | null
    _max: TopicEvidenceMaxAggregateOutputType | null
  }

  type GetTopicEvidenceGroupByPayload<T extends TopicEvidenceGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TopicEvidenceGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TopicEvidenceGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TopicEvidenceGroupByOutputType[P]>
            : GetScalarType<T[P], TopicEvidenceGroupByOutputType[P]>
        }
      >
    >


  export type TopicEvidenceSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    topic?: boolean
    bucketTime?: boolean
    postId?: boolean
    createdAt?: boolean
    post?: boolean | PostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["topicEvidence"]>

  export type TopicEvidenceSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    topic?: boolean
    bucketTime?: boolean
    postId?: boolean
    createdAt?: boolean
    post?: boolean | PostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["topicEvidence"]>

  export type TopicEvidenceSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    topic?: boolean
    bucketTime?: boolean
    postId?: boolean
    createdAt?: boolean
    post?: boolean | PostDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["topicEvidence"]>

  export type TopicEvidenceSelectScalar = {
    id?: boolean
    topic?: boolean
    bucketTime?: boolean
    postId?: boolean
    createdAt?: boolean
  }

  export type TopicEvidenceOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "topic" | "bucketTime" | "postId" | "createdAt", ExtArgs["result"]["topicEvidence"]>
  export type TopicEvidenceInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | PostDefaultArgs<ExtArgs>
  }
  export type TopicEvidenceIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | PostDefaultArgs<ExtArgs>
  }
  export type TopicEvidenceIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    post?: boolean | PostDefaultArgs<ExtArgs>
  }

  export type $TopicEvidencePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TopicEvidence"
    objects: {
      post: Prisma.$PostPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      topic: string
      bucketTime: Date
      postId: number
      createdAt: Date
    }, ExtArgs["result"]["topicEvidence"]>
    composites: {}
  }

  type TopicEvidenceGetPayload<S extends boolean | null | undefined | TopicEvidenceDefaultArgs> = $Result.GetResult<Prisma.$TopicEvidencePayload, S>

  type TopicEvidenceCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TopicEvidenceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TopicEvidenceCountAggregateInputType | true
    }

  export interface TopicEvidenceDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TopicEvidence'], meta: { name: 'TopicEvidence' } }
    /**
     * Find zero or one TopicEvidence that matches the filter.
     * @param {TopicEvidenceFindUniqueArgs} args - Arguments to find a TopicEvidence
     * @example
     * // Get one TopicEvidence
     * const topicEvidence = await prisma.topicEvidence.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TopicEvidenceFindUniqueArgs>(args: SelectSubset<T, TopicEvidenceFindUniqueArgs<ExtArgs>>): Prisma__TopicEvidenceClient<$Result.GetResult<Prisma.$TopicEvidencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one TopicEvidence that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TopicEvidenceFindUniqueOrThrowArgs} args - Arguments to find a TopicEvidence
     * @example
     * // Get one TopicEvidence
     * const topicEvidence = await prisma.topicEvidence.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TopicEvidenceFindUniqueOrThrowArgs>(args: SelectSubset<T, TopicEvidenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TopicEvidenceClient<$Result.GetResult<Prisma.$TopicEvidencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TopicEvidence that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicEvidenceFindFirstArgs} args - Arguments to find a TopicEvidence
     * @example
     * // Get one TopicEvidence
     * const topicEvidence = await prisma.topicEvidence.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TopicEvidenceFindFirstArgs>(args?: SelectSubset<T, TopicEvidenceFindFirstArgs<ExtArgs>>): Prisma__TopicEvidenceClient<$Result.GetResult<Prisma.$TopicEvidencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first TopicEvidence that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicEvidenceFindFirstOrThrowArgs} args - Arguments to find a TopicEvidence
     * @example
     * // Get one TopicEvidence
     * const topicEvidence = await prisma.topicEvidence.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TopicEvidenceFindFirstOrThrowArgs>(args?: SelectSubset<T, TopicEvidenceFindFirstOrThrowArgs<ExtArgs>>): Prisma__TopicEvidenceClient<$Result.GetResult<Prisma.$TopicEvidencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more TopicEvidences that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicEvidenceFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TopicEvidences
     * const topicEvidences = await prisma.topicEvidence.findMany()
     * 
     * // Get first 10 TopicEvidences
     * const topicEvidences = await prisma.topicEvidence.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const topicEvidenceWithIdOnly = await prisma.topicEvidence.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TopicEvidenceFindManyArgs>(args?: SelectSubset<T, TopicEvidenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicEvidencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a TopicEvidence.
     * @param {TopicEvidenceCreateArgs} args - Arguments to create a TopicEvidence.
     * @example
     * // Create one TopicEvidence
     * const TopicEvidence = await prisma.topicEvidence.create({
     *   data: {
     *     // ... data to create a TopicEvidence
     *   }
     * })
     * 
     */
    create<T extends TopicEvidenceCreateArgs>(args: SelectSubset<T, TopicEvidenceCreateArgs<ExtArgs>>): Prisma__TopicEvidenceClient<$Result.GetResult<Prisma.$TopicEvidencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many TopicEvidences.
     * @param {TopicEvidenceCreateManyArgs} args - Arguments to create many TopicEvidences.
     * @example
     * // Create many TopicEvidences
     * const topicEvidence = await prisma.topicEvidence.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TopicEvidenceCreateManyArgs>(args?: SelectSubset<T, TopicEvidenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TopicEvidences and returns the data saved in the database.
     * @param {TopicEvidenceCreateManyAndReturnArgs} args - Arguments to create many TopicEvidences.
     * @example
     * // Create many TopicEvidences
     * const topicEvidence = await prisma.topicEvidence.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TopicEvidences and only return the `id`
     * const topicEvidenceWithIdOnly = await prisma.topicEvidence.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TopicEvidenceCreateManyAndReturnArgs>(args?: SelectSubset<T, TopicEvidenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicEvidencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a TopicEvidence.
     * @param {TopicEvidenceDeleteArgs} args - Arguments to delete one TopicEvidence.
     * @example
     * // Delete one TopicEvidence
     * const TopicEvidence = await prisma.topicEvidence.delete({
     *   where: {
     *     // ... filter to delete one TopicEvidence
     *   }
     * })
     * 
     */
    delete<T extends TopicEvidenceDeleteArgs>(args: SelectSubset<T, TopicEvidenceDeleteArgs<ExtArgs>>): Prisma__TopicEvidenceClient<$Result.GetResult<Prisma.$TopicEvidencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one TopicEvidence.
     * @param {TopicEvidenceUpdateArgs} args - Arguments to update one TopicEvidence.
     * @example
     * // Update one TopicEvidence
     * const topicEvidence = await prisma.topicEvidence.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TopicEvidenceUpdateArgs>(args: SelectSubset<T, TopicEvidenceUpdateArgs<ExtArgs>>): Prisma__TopicEvidenceClient<$Result.GetResult<Prisma.$TopicEvidencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more TopicEvidences.
     * @param {TopicEvidenceDeleteManyArgs} args - Arguments to filter TopicEvidences to delete.
     * @example
     * // Delete a few TopicEvidences
     * const { count } = await prisma.topicEvidence.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TopicEvidenceDeleteManyArgs>(args?: SelectSubset<T, TopicEvidenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TopicEvidences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicEvidenceUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TopicEvidences
     * const topicEvidence = await prisma.topicEvidence.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TopicEvidenceUpdateManyArgs>(args: SelectSubset<T, TopicEvidenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TopicEvidences and returns the data updated in the database.
     * @param {TopicEvidenceUpdateManyAndReturnArgs} args - Arguments to update many TopicEvidences.
     * @example
     * // Update many TopicEvidences
     * const topicEvidence = await prisma.topicEvidence.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more TopicEvidences and only return the `id`
     * const topicEvidenceWithIdOnly = await prisma.topicEvidence.updateManyAndReturn({
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
    updateManyAndReturn<T extends TopicEvidenceUpdateManyAndReturnArgs>(args: SelectSubset<T, TopicEvidenceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicEvidencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one TopicEvidence.
     * @param {TopicEvidenceUpsertArgs} args - Arguments to update or create a TopicEvidence.
     * @example
     * // Update or create a TopicEvidence
     * const topicEvidence = await prisma.topicEvidence.upsert({
     *   create: {
     *     // ... data to create a TopicEvidence
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TopicEvidence we want to update
     *   }
     * })
     */
    upsert<T extends TopicEvidenceUpsertArgs>(args: SelectSubset<T, TopicEvidenceUpsertArgs<ExtArgs>>): Prisma__TopicEvidenceClient<$Result.GetResult<Prisma.$TopicEvidencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of TopicEvidences.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicEvidenceCountArgs} args - Arguments to filter TopicEvidences to count.
     * @example
     * // Count the number of TopicEvidences
     * const count = await prisma.topicEvidence.count({
     *   where: {
     *     // ... the filter for the TopicEvidences we want to count
     *   }
     * })
    **/
    count<T extends TopicEvidenceCountArgs>(
      args?: Subset<T, TopicEvidenceCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TopicEvidenceCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TopicEvidence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicEvidenceAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends TopicEvidenceAggregateArgs>(args: Subset<T, TopicEvidenceAggregateArgs>): Prisma.PrismaPromise<GetTopicEvidenceAggregateType<T>>

    /**
     * Group by TopicEvidence.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicEvidenceGroupByArgs} args - Group by arguments.
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
      T extends TopicEvidenceGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TopicEvidenceGroupByArgs['orderBy'] }
        : { orderBy?: TopicEvidenceGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, TopicEvidenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTopicEvidenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TopicEvidence model
   */
  readonly fields: TopicEvidenceFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TopicEvidence.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TopicEvidenceClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
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
   * Fields of the TopicEvidence model
   */
  interface TopicEvidenceFieldRefs {
    readonly id: FieldRef<"TopicEvidence", 'Int'>
    readonly topic: FieldRef<"TopicEvidence", 'String'>
    readonly bucketTime: FieldRef<"TopicEvidence", 'DateTime'>
    readonly postId: FieldRef<"TopicEvidence", 'Int'>
    readonly createdAt: FieldRef<"TopicEvidence", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TopicEvidence findUnique
   */
  export type TopicEvidenceFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicEvidence
     */
    select?: TopicEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicEvidence
     */
    omit?: TopicEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicEvidenceInclude<ExtArgs> | null
    /**
     * Filter, which TopicEvidence to fetch.
     */
    where: TopicEvidenceWhereUniqueInput
  }

  /**
   * TopicEvidence findUniqueOrThrow
   */
  export type TopicEvidenceFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicEvidence
     */
    select?: TopicEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicEvidence
     */
    omit?: TopicEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicEvidenceInclude<ExtArgs> | null
    /**
     * Filter, which TopicEvidence to fetch.
     */
    where: TopicEvidenceWhereUniqueInput
  }

  /**
   * TopicEvidence findFirst
   */
  export type TopicEvidenceFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicEvidence
     */
    select?: TopicEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicEvidence
     */
    omit?: TopicEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicEvidenceInclude<ExtArgs> | null
    /**
     * Filter, which TopicEvidence to fetch.
     */
    where?: TopicEvidenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicEvidences to fetch.
     */
    orderBy?: TopicEvidenceOrderByWithRelationInput | TopicEvidenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TopicEvidences.
     */
    cursor?: TopicEvidenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicEvidences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicEvidences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TopicEvidences.
     */
    distinct?: TopicEvidenceScalarFieldEnum | TopicEvidenceScalarFieldEnum[]
  }

  /**
   * TopicEvidence findFirstOrThrow
   */
  export type TopicEvidenceFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicEvidence
     */
    select?: TopicEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicEvidence
     */
    omit?: TopicEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicEvidenceInclude<ExtArgs> | null
    /**
     * Filter, which TopicEvidence to fetch.
     */
    where?: TopicEvidenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicEvidences to fetch.
     */
    orderBy?: TopicEvidenceOrderByWithRelationInput | TopicEvidenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TopicEvidences.
     */
    cursor?: TopicEvidenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicEvidences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicEvidences.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TopicEvidences.
     */
    distinct?: TopicEvidenceScalarFieldEnum | TopicEvidenceScalarFieldEnum[]
  }

  /**
   * TopicEvidence findMany
   */
  export type TopicEvidenceFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicEvidence
     */
    select?: TopicEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicEvidence
     */
    omit?: TopicEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicEvidenceInclude<ExtArgs> | null
    /**
     * Filter, which TopicEvidences to fetch.
     */
    where?: TopicEvidenceWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TopicEvidences to fetch.
     */
    orderBy?: TopicEvidenceOrderByWithRelationInput | TopicEvidenceOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TopicEvidences.
     */
    cursor?: TopicEvidenceWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TopicEvidences from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TopicEvidences.
     */
    skip?: number
    distinct?: TopicEvidenceScalarFieldEnum | TopicEvidenceScalarFieldEnum[]
  }

  /**
   * TopicEvidence create
   */
  export type TopicEvidenceCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicEvidence
     */
    select?: TopicEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicEvidence
     */
    omit?: TopicEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicEvidenceInclude<ExtArgs> | null
    /**
     * The data needed to create a TopicEvidence.
     */
    data: XOR<TopicEvidenceCreateInput, TopicEvidenceUncheckedCreateInput>
  }

  /**
   * TopicEvidence createMany
   */
  export type TopicEvidenceCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TopicEvidences.
     */
    data: TopicEvidenceCreateManyInput | TopicEvidenceCreateManyInput[]
  }

  /**
   * TopicEvidence createManyAndReturn
   */
  export type TopicEvidenceCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicEvidence
     */
    select?: TopicEvidenceSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TopicEvidence
     */
    omit?: TopicEvidenceOmit<ExtArgs> | null
    /**
     * The data used to create many TopicEvidences.
     */
    data: TopicEvidenceCreateManyInput | TopicEvidenceCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicEvidenceIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TopicEvidence update
   */
  export type TopicEvidenceUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicEvidence
     */
    select?: TopicEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicEvidence
     */
    omit?: TopicEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicEvidenceInclude<ExtArgs> | null
    /**
     * The data needed to update a TopicEvidence.
     */
    data: XOR<TopicEvidenceUpdateInput, TopicEvidenceUncheckedUpdateInput>
    /**
     * Choose, which TopicEvidence to update.
     */
    where: TopicEvidenceWhereUniqueInput
  }

  /**
   * TopicEvidence updateMany
   */
  export type TopicEvidenceUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TopicEvidences.
     */
    data: XOR<TopicEvidenceUpdateManyMutationInput, TopicEvidenceUncheckedUpdateManyInput>
    /**
     * Filter which TopicEvidences to update
     */
    where?: TopicEvidenceWhereInput
    /**
     * Limit how many TopicEvidences to update.
     */
    limit?: number
  }

  /**
   * TopicEvidence updateManyAndReturn
   */
  export type TopicEvidenceUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicEvidence
     */
    select?: TopicEvidenceSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the TopicEvidence
     */
    omit?: TopicEvidenceOmit<ExtArgs> | null
    /**
     * The data used to update TopicEvidences.
     */
    data: XOR<TopicEvidenceUpdateManyMutationInput, TopicEvidenceUncheckedUpdateManyInput>
    /**
     * Filter which TopicEvidences to update
     */
    where?: TopicEvidenceWhereInput
    /**
     * Limit how many TopicEvidences to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicEvidenceIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * TopicEvidence upsert
   */
  export type TopicEvidenceUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicEvidence
     */
    select?: TopicEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicEvidence
     */
    omit?: TopicEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicEvidenceInclude<ExtArgs> | null
    /**
     * The filter to search for the TopicEvidence to update in case it exists.
     */
    where: TopicEvidenceWhereUniqueInput
    /**
     * In case the TopicEvidence found by the `where` argument doesn't exist, create a new TopicEvidence with this data.
     */
    create: XOR<TopicEvidenceCreateInput, TopicEvidenceUncheckedCreateInput>
    /**
     * In case the TopicEvidence was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TopicEvidenceUpdateInput, TopicEvidenceUncheckedUpdateInput>
  }

  /**
   * TopicEvidence delete
   */
  export type TopicEvidenceDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicEvidence
     */
    select?: TopicEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicEvidence
     */
    omit?: TopicEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicEvidenceInclude<ExtArgs> | null
    /**
     * Filter which TopicEvidence to delete.
     */
    where: TopicEvidenceWhereUniqueInput
  }

  /**
   * TopicEvidence deleteMany
   */
  export type TopicEvidenceDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TopicEvidences to delete
     */
    where?: TopicEvidenceWhereInput
    /**
     * Limit how many TopicEvidences to delete.
     */
    limit?: number
  }

  /**
   * TopicEvidence without action
   */
  export type TopicEvidenceDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicEvidence
     */
    select?: TopicEvidenceSelect<ExtArgs> | null
    /**
     * Omit specific fields from the TopicEvidence
     */
    omit?: TopicEvidenceOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicEvidenceInclude<ExtArgs> | null
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
    createdAt: 'createdAt',
    fetchedAt: 'fetchedAt'
  };

  export type PostScalarFieldEnum = (typeof PostScalarFieldEnum)[keyof typeof PostScalarFieldEnum]


  export const TopicCountScalarFieldEnum: {
    id: 'id',
    topic: 'topic',
    topicLabel: 'topicLabel',
    bucketTime: 'bucketTime',
    count: 'count'
  };

  export type TopicCountScalarFieldEnum = (typeof TopicCountScalarFieldEnum)[keyof typeof TopicCountScalarFieldEnum]


  export const TopicEvidenceScalarFieldEnum: {
    id: 'id',
    topic: 'topic',
    bucketTime: 'bucketTime',
    postId: 'postId',
    createdAt: 'createdAt'
  };

  export type TopicEvidenceScalarFieldEnum = (typeof TopicEvidenceScalarFieldEnum)[keyof typeof TopicEvidenceScalarFieldEnum]


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
    createdAt?: DateTimeNullableFilter<"Post"> | Date | string | null
    fetchedAt?: DateTimeFilter<"Post"> | Date | string
    evidences?: TopicEvidenceListRelationFilter
  }

  export type PostOrderByWithRelationInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrder
    title?: SortOrder
    createdAt?: SortOrderInput | SortOrder
    fetchedAt?: SortOrder
    evidences?: TopicEvidenceOrderByRelationAggregateInput
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
    createdAt?: DateTimeNullableFilter<"Post"> | Date | string | null
    fetchedAt?: DateTimeFilter<"Post"> | Date | string
    evidences?: TopicEvidenceListRelationFilter
  }, "id" | "source_externalId">

  export type PostOrderByWithAggregationInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrder
    title?: SortOrder
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
    createdAt?: DateTimeNullableWithAggregatesFilter<"Post"> | Date | string | null
    fetchedAt?: DateTimeWithAggregatesFilter<"Post"> | Date | string
  }

  export type TopicCountWhereInput = {
    AND?: TopicCountWhereInput | TopicCountWhereInput[]
    OR?: TopicCountWhereInput[]
    NOT?: TopicCountWhereInput | TopicCountWhereInput[]
    id?: IntFilter<"TopicCount"> | number
    topic?: StringFilter<"TopicCount"> | string
    topicLabel?: StringFilter<"TopicCount"> | string
    bucketTime?: DateTimeFilter<"TopicCount"> | Date | string
    count?: IntFilter<"TopicCount"> | number
  }

  export type TopicCountOrderByWithRelationInput = {
    id?: SortOrder
    topic?: SortOrder
    topicLabel?: SortOrder
    bucketTime?: SortOrder
    count?: SortOrder
  }

  export type TopicCountWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    topic_bucketTime?: TopicCountTopicBucketTimeCompoundUniqueInput
    AND?: TopicCountWhereInput | TopicCountWhereInput[]
    OR?: TopicCountWhereInput[]
    NOT?: TopicCountWhereInput | TopicCountWhereInput[]
    topic?: StringFilter<"TopicCount"> | string
    topicLabel?: StringFilter<"TopicCount"> | string
    bucketTime?: DateTimeFilter<"TopicCount"> | Date | string
    count?: IntFilter<"TopicCount"> | number
  }, "id" | "topic_bucketTime">

  export type TopicCountOrderByWithAggregationInput = {
    id?: SortOrder
    topic?: SortOrder
    topicLabel?: SortOrder
    bucketTime?: SortOrder
    count?: SortOrder
    _count?: TopicCountCountOrderByAggregateInput
    _avg?: TopicCountAvgOrderByAggregateInput
    _max?: TopicCountMaxOrderByAggregateInput
    _min?: TopicCountMinOrderByAggregateInput
    _sum?: TopicCountSumOrderByAggregateInput
  }

  export type TopicCountScalarWhereWithAggregatesInput = {
    AND?: TopicCountScalarWhereWithAggregatesInput | TopicCountScalarWhereWithAggregatesInput[]
    OR?: TopicCountScalarWhereWithAggregatesInput[]
    NOT?: TopicCountScalarWhereWithAggregatesInput | TopicCountScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TopicCount"> | number
    topic?: StringWithAggregatesFilter<"TopicCount"> | string
    topicLabel?: StringWithAggregatesFilter<"TopicCount"> | string
    bucketTime?: DateTimeWithAggregatesFilter<"TopicCount"> | Date | string
    count?: IntWithAggregatesFilter<"TopicCount"> | number
  }

  export type TopicEvidenceWhereInput = {
    AND?: TopicEvidenceWhereInput | TopicEvidenceWhereInput[]
    OR?: TopicEvidenceWhereInput[]
    NOT?: TopicEvidenceWhereInput | TopicEvidenceWhereInput[]
    id?: IntFilter<"TopicEvidence"> | number
    topic?: StringFilter<"TopicEvidence"> | string
    bucketTime?: DateTimeFilter<"TopicEvidence"> | Date | string
    postId?: IntFilter<"TopicEvidence"> | number
    createdAt?: DateTimeFilter<"TopicEvidence"> | Date | string
    post?: XOR<PostScalarRelationFilter, PostWhereInput>
  }

  export type TopicEvidenceOrderByWithRelationInput = {
    id?: SortOrder
    topic?: SortOrder
    bucketTime?: SortOrder
    postId?: SortOrder
    createdAt?: SortOrder
    post?: PostOrderByWithRelationInput
  }

  export type TopicEvidenceWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    topic_bucketTime_postId?: TopicEvidenceTopicBucketTimePostIdCompoundUniqueInput
    AND?: TopicEvidenceWhereInput | TopicEvidenceWhereInput[]
    OR?: TopicEvidenceWhereInput[]
    NOT?: TopicEvidenceWhereInput | TopicEvidenceWhereInput[]
    topic?: StringFilter<"TopicEvidence"> | string
    bucketTime?: DateTimeFilter<"TopicEvidence"> | Date | string
    postId?: IntFilter<"TopicEvidence"> | number
    createdAt?: DateTimeFilter<"TopicEvidence"> | Date | string
    post?: XOR<PostScalarRelationFilter, PostWhereInput>
  }, "id" | "topic_bucketTime_postId">

  export type TopicEvidenceOrderByWithAggregationInput = {
    id?: SortOrder
    topic?: SortOrder
    bucketTime?: SortOrder
    postId?: SortOrder
    createdAt?: SortOrder
    _count?: TopicEvidenceCountOrderByAggregateInput
    _avg?: TopicEvidenceAvgOrderByAggregateInput
    _max?: TopicEvidenceMaxOrderByAggregateInput
    _min?: TopicEvidenceMinOrderByAggregateInput
    _sum?: TopicEvidenceSumOrderByAggregateInput
  }

  export type TopicEvidenceScalarWhereWithAggregatesInput = {
    AND?: TopicEvidenceScalarWhereWithAggregatesInput | TopicEvidenceScalarWhereWithAggregatesInput[]
    OR?: TopicEvidenceScalarWhereWithAggregatesInput[]
    NOT?: TopicEvidenceScalarWhereWithAggregatesInput | TopicEvidenceScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"TopicEvidence"> | number
    topic?: StringWithAggregatesFilter<"TopicEvidence"> | string
    bucketTime?: DateTimeWithAggregatesFilter<"TopicEvidence"> | Date | string
    postId?: IntWithAggregatesFilter<"TopicEvidence"> | number
    createdAt?: DateTimeWithAggregatesFilter<"TopicEvidence"> | Date | string
  }

  export type PostCreateInput = {
    source: string
    externalId: string
    title: string
    createdAt?: Date | string | null
    fetchedAt?: Date | string
    evidences?: TopicEvidenceCreateNestedManyWithoutPostInput
  }

  export type PostUncheckedCreateInput = {
    id?: number
    source: string
    externalId: string
    title: string
    createdAt?: Date | string | null
    fetchedAt?: Date | string
    evidences?: TopicEvidenceUncheckedCreateNestedManyWithoutPostInput
  }

  export type PostUpdateInput = {
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    evidences?: TopicEvidenceUpdateManyWithoutPostNestedInput
  }

  export type PostUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    evidences?: TopicEvidenceUncheckedUpdateManyWithoutPostNestedInput
  }

  export type PostCreateManyInput = {
    id?: number
    source: string
    externalId: string
    title: string
    createdAt?: Date | string | null
    fetchedAt?: Date | string
  }

  export type PostUpdateManyMutationInput = {
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicCountCreateInput = {
    topic: string
    topicLabel?: string
    bucketTime: Date | string
    count: number
  }

  export type TopicCountUncheckedCreateInput = {
    id?: number
    topic: string
    topicLabel?: string
    bucketTime: Date | string
    count: number
  }

  export type TopicCountUpdateInput = {
    topic?: StringFieldUpdateOperationsInput | string
    topicLabel?: StringFieldUpdateOperationsInput | string
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
    count?: IntFieldUpdateOperationsInput | number
  }

  export type TopicCountUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    topic?: StringFieldUpdateOperationsInput | string
    topicLabel?: StringFieldUpdateOperationsInput | string
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
    count?: IntFieldUpdateOperationsInput | number
  }

  export type TopicCountCreateManyInput = {
    id?: number
    topic: string
    topicLabel?: string
    bucketTime: Date | string
    count: number
  }

  export type TopicCountUpdateManyMutationInput = {
    topic?: StringFieldUpdateOperationsInput | string
    topicLabel?: StringFieldUpdateOperationsInput | string
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
    count?: IntFieldUpdateOperationsInput | number
  }

  export type TopicCountUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    topic?: StringFieldUpdateOperationsInput | string
    topicLabel?: StringFieldUpdateOperationsInput | string
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
    count?: IntFieldUpdateOperationsInput | number
  }

  export type TopicEvidenceCreateInput = {
    topic: string
    bucketTime: Date | string
    createdAt?: Date | string
    post: PostCreateNestedOneWithoutEvidencesInput
  }

  export type TopicEvidenceUncheckedCreateInput = {
    id?: number
    topic: string
    bucketTime: Date | string
    postId: number
    createdAt?: Date | string
  }

  export type TopicEvidenceUpdateInput = {
    topic?: StringFieldUpdateOperationsInput | string
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    post?: PostUpdateOneRequiredWithoutEvidencesNestedInput
  }

  export type TopicEvidenceUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    topic?: StringFieldUpdateOperationsInput | string
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
    postId?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicEvidenceCreateManyInput = {
    id?: number
    topic: string
    bucketTime: Date | string
    postId: number
    createdAt?: Date | string
  }

  export type TopicEvidenceUpdateManyMutationInput = {
    topic?: StringFieldUpdateOperationsInput | string
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicEvidenceUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    topic?: StringFieldUpdateOperationsInput | string
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type TopicEvidenceListRelationFilter = {
    every?: TopicEvidenceWhereInput
    some?: TopicEvidenceWhereInput
    none?: TopicEvidenceWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TopicEvidenceOrderByRelationAggregateInput = {
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
    createdAt?: SortOrder
    fetchedAt?: SortOrder
  }

  export type PostMinOrderByAggregateInput = {
    id?: SortOrder
    source?: SortOrder
    externalId?: SortOrder
    title?: SortOrder
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

  export type TopicCountTopicBucketTimeCompoundUniqueInput = {
    topic: string
    bucketTime: Date | string
  }

  export type TopicCountCountOrderByAggregateInput = {
    id?: SortOrder
    topic?: SortOrder
    topicLabel?: SortOrder
    bucketTime?: SortOrder
    count?: SortOrder
  }

  export type TopicCountAvgOrderByAggregateInput = {
    id?: SortOrder
    count?: SortOrder
  }

  export type TopicCountMaxOrderByAggregateInput = {
    id?: SortOrder
    topic?: SortOrder
    topicLabel?: SortOrder
    bucketTime?: SortOrder
    count?: SortOrder
  }

  export type TopicCountMinOrderByAggregateInput = {
    id?: SortOrder
    topic?: SortOrder
    topicLabel?: SortOrder
    bucketTime?: SortOrder
    count?: SortOrder
  }

  export type TopicCountSumOrderByAggregateInput = {
    id?: SortOrder
    count?: SortOrder
  }

  export type PostScalarRelationFilter = {
    is?: PostWhereInput
    isNot?: PostWhereInput
  }

  export type TopicEvidenceTopicBucketTimePostIdCompoundUniqueInput = {
    topic: string
    bucketTime: Date | string
    postId: number
  }

  export type TopicEvidenceCountOrderByAggregateInput = {
    id?: SortOrder
    topic?: SortOrder
    bucketTime?: SortOrder
    postId?: SortOrder
    createdAt?: SortOrder
  }

  export type TopicEvidenceAvgOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
  }

  export type TopicEvidenceMaxOrderByAggregateInput = {
    id?: SortOrder
    topic?: SortOrder
    bucketTime?: SortOrder
    postId?: SortOrder
    createdAt?: SortOrder
  }

  export type TopicEvidenceMinOrderByAggregateInput = {
    id?: SortOrder
    topic?: SortOrder
    bucketTime?: SortOrder
    postId?: SortOrder
    createdAt?: SortOrder
  }

  export type TopicEvidenceSumOrderByAggregateInput = {
    id?: SortOrder
    postId?: SortOrder
  }

  export type TopicEvidenceCreateNestedManyWithoutPostInput = {
    create?: XOR<TopicEvidenceCreateWithoutPostInput, TopicEvidenceUncheckedCreateWithoutPostInput> | TopicEvidenceCreateWithoutPostInput[] | TopicEvidenceUncheckedCreateWithoutPostInput[]
    connectOrCreate?: TopicEvidenceCreateOrConnectWithoutPostInput | TopicEvidenceCreateOrConnectWithoutPostInput[]
    createMany?: TopicEvidenceCreateManyPostInputEnvelope
    connect?: TopicEvidenceWhereUniqueInput | TopicEvidenceWhereUniqueInput[]
  }

  export type TopicEvidenceUncheckedCreateNestedManyWithoutPostInput = {
    create?: XOR<TopicEvidenceCreateWithoutPostInput, TopicEvidenceUncheckedCreateWithoutPostInput> | TopicEvidenceCreateWithoutPostInput[] | TopicEvidenceUncheckedCreateWithoutPostInput[]
    connectOrCreate?: TopicEvidenceCreateOrConnectWithoutPostInput | TopicEvidenceCreateOrConnectWithoutPostInput[]
    createMany?: TopicEvidenceCreateManyPostInputEnvelope
    connect?: TopicEvidenceWhereUniqueInput | TopicEvidenceWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type TopicEvidenceUpdateManyWithoutPostNestedInput = {
    create?: XOR<TopicEvidenceCreateWithoutPostInput, TopicEvidenceUncheckedCreateWithoutPostInput> | TopicEvidenceCreateWithoutPostInput[] | TopicEvidenceUncheckedCreateWithoutPostInput[]
    connectOrCreate?: TopicEvidenceCreateOrConnectWithoutPostInput | TopicEvidenceCreateOrConnectWithoutPostInput[]
    upsert?: TopicEvidenceUpsertWithWhereUniqueWithoutPostInput | TopicEvidenceUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: TopicEvidenceCreateManyPostInputEnvelope
    set?: TopicEvidenceWhereUniqueInput | TopicEvidenceWhereUniqueInput[]
    disconnect?: TopicEvidenceWhereUniqueInput | TopicEvidenceWhereUniqueInput[]
    delete?: TopicEvidenceWhereUniqueInput | TopicEvidenceWhereUniqueInput[]
    connect?: TopicEvidenceWhereUniqueInput | TopicEvidenceWhereUniqueInput[]
    update?: TopicEvidenceUpdateWithWhereUniqueWithoutPostInput | TopicEvidenceUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: TopicEvidenceUpdateManyWithWhereWithoutPostInput | TopicEvidenceUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: TopicEvidenceScalarWhereInput | TopicEvidenceScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type TopicEvidenceUncheckedUpdateManyWithoutPostNestedInput = {
    create?: XOR<TopicEvidenceCreateWithoutPostInput, TopicEvidenceUncheckedCreateWithoutPostInput> | TopicEvidenceCreateWithoutPostInput[] | TopicEvidenceUncheckedCreateWithoutPostInput[]
    connectOrCreate?: TopicEvidenceCreateOrConnectWithoutPostInput | TopicEvidenceCreateOrConnectWithoutPostInput[]
    upsert?: TopicEvidenceUpsertWithWhereUniqueWithoutPostInput | TopicEvidenceUpsertWithWhereUniqueWithoutPostInput[]
    createMany?: TopicEvidenceCreateManyPostInputEnvelope
    set?: TopicEvidenceWhereUniqueInput | TopicEvidenceWhereUniqueInput[]
    disconnect?: TopicEvidenceWhereUniqueInput | TopicEvidenceWhereUniqueInput[]
    delete?: TopicEvidenceWhereUniqueInput | TopicEvidenceWhereUniqueInput[]
    connect?: TopicEvidenceWhereUniqueInput | TopicEvidenceWhereUniqueInput[]
    update?: TopicEvidenceUpdateWithWhereUniqueWithoutPostInput | TopicEvidenceUpdateWithWhereUniqueWithoutPostInput[]
    updateMany?: TopicEvidenceUpdateManyWithWhereWithoutPostInput | TopicEvidenceUpdateManyWithWhereWithoutPostInput[]
    deleteMany?: TopicEvidenceScalarWhereInput | TopicEvidenceScalarWhereInput[]
  }

  export type PostCreateNestedOneWithoutEvidencesInput = {
    create?: XOR<PostCreateWithoutEvidencesInput, PostUncheckedCreateWithoutEvidencesInput>
    connectOrCreate?: PostCreateOrConnectWithoutEvidencesInput
    connect?: PostWhereUniqueInput
  }

  export type PostUpdateOneRequiredWithoutEvidencesNestedInput = {
    create?: XOR<PostCreateWithoutEvidencesInput, PostUncheckedCreateWithoutEvidencesInput>
    connectOrCreate?: PostCreateOrConnectWithoutEvidencesInput
    upsert?: PostUpsertWithoutEvidencesInput
    connect?: PostWhereUniqueInput
    update?: XOR<XOR<PostUpdateToOneWithWhereWithoutEvidencesInput, PostUpdateWithoutEvidencesInput>, PostUncheckedUpdateWithoutEvidencesInput>
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

  export type TopicEvidenceCreateWithoutPostInput = {
    topic: string
    bucketTime: Date | string
    createdAt?: Date | string
  }

  export type TopicEvidenceUncheckedCreateWithoutPostInput = {
    id?: number
    topic: string
    bucketTime: Date | string
    createdAt?: Date | string
  }

  export type TopicEvidenceCreateOrConnectWithoutPostInput = {
    where: TopicEvidenceWhereUniqueInput
    create: XOR<TopicEvidenceCreateWithoutPostInput, TopicEvidenceUncheckedCreateWithoutPostInput>
  }

  export type TopicEvidenceCreateManyPostInputEnvelope = {
    data: TopicEvidenceCreateManyPostInput | TopicEvidenceCreateManyPostInput[]
  }

  export type TopicEvidenceUpsertWithWhereUniqueWithoutPostInput = {
    where: TopicEvidenceWhereUniqueInput
    update: XOR<TopicEvidenceUpdateWithoutPostInput, TopicEvidenceUncheckedUpdateWithoutPostInput>
    create: XOR<TopicEvidenceCreateWithoutPostInput, TopicEvidenceUncheckedCreateWithoutPostInput>
  }

  export type TopicEvidenceUpdateWithWhereUniqueWithoutPostInput = {
    where: TopicEvidenceWhereUniqueInput
    data: XOR<TopicEvidenceUpdateWithoutPostInput, TopicEvidenceUncheckedUpdateWithoutPostInput>
  }

  export type TopicEvidenceUpdateManyWithWhereWithoutPostInput = {
    where: TopicEvidenceScalarWhereInput
    data: XOR<TopicEvidenceUpdateManyMutationInput, TopicEvidenceUncheckedUpdateManyWithoutPostInput>
  }

  export type TopicEvidenceScalarWhereInput = {
    AND?: TopicEvidenceScalarWhereInput | TopicEvidenceScalarWhereInput[]
    OR?: TopicEvidenceScalarWhereInput[]
    NOT?: TopicEvidenceScalarWhereInput | TopicEvidenceScalarWhereInput[]
    id?: IntFilter<"TopicEvidence"> | number
    topic?: StringFilter<"TopicEvidence"> | string
    bucketTime?: DateTimeFilter<"TopicEvidence"> | Date | string
    postId?: IntFilter<"TopicEvidence"> | number
    createdAt?: DateTimeFilter<"TopicEvidence"> | Date | string
  }

  export type PostCreateWithoutEvidencesInput = {
    source: string
    externalId: string
    title: string
    createdAt?: Date | string | null
    fetchedAt?: Date | string
  }

  export type PostUncheckedCreateWithoutEvidencesInput = {
    id?: number
    source: string
    externalId: string
    title: string
    createdAt?: Date | string | null
    fetchedAt?: Date | string
  }

  export type PostCreateOrConnectWithoutEvidencesInput = {
    where: PostWhereUniqueInput
    create: XOR<PostCreateWithoutEvidencesInput, PostUncheckedCreateWithoutEvidencesInput>
  }

  export type PostUpsertWithoutEvidencesInput = {
    update: XOR<PostUpdateWithoutEvidencesInput, PostUncheckedUpdateWithoutEvidencesInput>
    create: XOR<PostCreateWithoutEvidencesInput, PostUncheckedCreateWithoutEvidencesInput>
    where?: PostWhereInput
  }

  export type PostUpdateToOneWithWhereWithoutEvidencesInput = {
    where?: PostWhereInput
    data: XOR<PostUpdateWithoutEvidencesInput, PostUncheckedUpdateWithoutEvidencesInput>
  }

  export type PostUpdateWithoutEvidencesInput = {
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PostUncheckedUpdateWithoutEvidencesInput = {
    id?: IntFieldUpdateOperationsInput | number
    source?: StringFieldUpdateOperationsInput | string
    externalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    createdAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fetchedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicEvidenceCreateManyPostInput = {
    id?: number
    topic: string
    bucketTime: Date | string
    createdAt?: Date | string
  }

  export type TopicEvidenceUpdateWithoutPostInput = {
    topic?: StringFieldUpdateOperationsInput | string
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicEvidenceUncheckedUpdateWithoutPostInput = {
    id?: IntFieldUpdateOperationsInput | number
    topic?: StringFieldUpdateOperationsInput | string
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicEvidenceUncheckedUpdateManyWithoutPostInput = {
    id?: IntFieldUpdateOperationsInput | number
    topic?: StringFieldUpdateOperationsInput | string
    bucketTime?: DateTimeFieldUpdateOperationsInput | Date | string
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