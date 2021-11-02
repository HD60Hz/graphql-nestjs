# About GraphQL

In recent years GraphQL has become very popular due to major advantages it offers against well known REST. Briefly,

- It eliminates over fetching & under fetching problems in REST
- With GraphQL, we don't need to version or api as in REST
- GraphQL imposes an opinionated structure which easily leads to standardization whithin teams
- Although this article is on creating an api, GraphQL is the best friend of frontend developers. The idea behind is to let the UI component decide its data reqirements and send a query to GraphQL to fetch exactly what it needs.

You can refer to [graphql-at-paypal-an-adoption-story](https://medium.com/paypal-tech/graphql-at-paypal-an-adoption-story-b7e01175f2b7) for a well detailed story

# About NestJS

Javascript developers loved Nodejs. Number of projects with Nodejs is getting heigher every day. Using the same language in frontend and also in backend is really awesome. Today we can create our web projects in much more isomorphic manner. This really reduce impedance mismatch between these two worlds.

If we scaffold a barebone development environment, we need to solve many cross-cutting concerns by ourselves. So, using a framework saves us from these headaches.

NestJS is a popular NodeJS framework. It has received near 1 million weekly download on npm and is being used in many projects. So, we can easily say that it's battle tested. It uses typescript out of the box. To me, it's very important for a reliable development framework.

NestJS has good documentation [NestJS](https://docs.nestjs.com/). You can also read for more detail on NestJS's advantages [why-choose-nest-js-over-other-node-frameworks](https://medium.com/habilelabs/why-choose-nest-js-over-other-node-frameworks-68a13fa1e2c8)

# Let's start

You can find the completed project in [Github](https://github.com/killjoy2013/graphql-nestjs)

We'll create a countries GraphQL api. Our data model shown below

![data-model](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/re8bmu3pcrzybqjur6iy.PNG)

- One country has many cities
- One city belongs to only one country
- One country can join many treaties
- One treaty has many countries

As can be noted, while there is a one-to-many relation between country & city, there is a many-to-many relation between country & treaty

# Project creation

NestJS has a very practical cli. For many tasks we'll be using it. Initially we need to install NestJS globally

`npm install -g @nestjs/cli` after installation we can check the version `nest -v`
To create a new project `nest new countries-graphql`. It'll ask your preferred package manager utility (npm or yarn) that's all.

Let's open countries-graphql directory (preferably in VSCode). As you see, a full featured project structure created. No need to bother with linting or typescript. Let's delete test directory, `src\app.controller.spec.ts`, `src\app.controller.ts`. Our initial project looks like below

![initial-project](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jmhst3k5nqxqu9dmyel6.PNG)

We should be able to run with `yarn start:dev`

In package.json file's script part has all the necessary scripts ready for starting or building the project. Very nice, we don't need to bother about watching changes etc...

As seen, there are `src\app.module.ts` and `src\app.service.ts`. NestJS imposes a module bases structure. While our application itself is a module, all our business logics will be in their own module. This leads to clean domain structure and all business logic will be created in its own service.

# GraphQL Code First

There are two approches for creating GraphQL schema;

1. Schema / SDL (Schema Definition Language) first
2. Code first

In the first approach, you define your GraphQL schema in SDL. Then you generate stub resolvers and add your code there.
The second approach is based on generating the schema from your code. i.e., you're not writing any SDL here. Code first is more developer friendly and we'll be following code first in this article.

Let's install some packages;

`yarn add graphql @nestjs/graphql apollo-server-express`

We'll add country, city and treaty modules. nest cli is very clever and lets you create various resource types. You see the list with `nest --help`

```ts
      ┌───────────────┬─────────────┬──────────────────────────────────────────────┐
      │ name          │ alias       │ description                                  │
      │ application   │ application │ Generate a new application workspace         │
      │ class         │ cl          │ Generate a new class                         │
      │ configuration │ config      │ Generate a CLI configuration file            │
      │ controller    │ co          │ Generate a controller declaration            │
      │ decorator     │ d           │ Generate a custom decorator                  │
      │ filter        │ f           │ Generate a filter declaration                │
      │ gateway       │ ga          │ Generate a gateway declaration               │
      │ guard         │ gu          │ Generate a guard declaration                 │
      │ interceptor   │ in          │ Generate an interceptor declaration          │
      │ interface     │ interface   │ Generate an interface                        │
      │ middleware    │ mi          │ Generate a middleware declaration            │
      │ module        │ mo          │ Generate a module declaration                │
      │ pipe          │ pi          │ Generate a pipe declaration                  │
      │ provider      │ pr          │ Generate a provider declaration              │
      │ resolver      │ r           │ Generate a GraphQL resolver declaration      │
      │ service       │ s           │ Generate a service declaration               │
      │ library       │ lib         │ Generate a new library within a monorepo     │
      │ sub-app       │ app         │ Generate a new application within a monorepo │
      │ resource      │ res         │ Generate a new CRUD resource                 │
      └───────────────┴─────────────┴──────────────────────────────────────────────┘
```

We'll create our modules as `resource`. Use the command `nest g resource country --no-spec` We're not creating tests in this article, so `--no-spec` flag prohibits test files from being generated

nest cli asks what kind of resource to ceate. As you can see, NestJS offers wide variaty of options. Let's pick GraphQL code first

![res-options](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/jedjkpenyurw149gwc5c.PNG)

Then we'be asked wether to ceate CRUD end points. Select yes.

`Would you like to generate CRUD entry points? (Y/n)`

Eventually, our country module has beed created. It's a full fledged module with its service, resolver, entities, dto.

![country-module](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/kuxkneaw8faoahwyd399.PNG)

NestJS added CountryModule added to app module as import. Every modules should be imported by app module;

_src/app.module.ts_

```ts
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CountryModule } from './country/country.module';

@Module({
  imports: [CountryModule],
  providers: [AppService],
})
export class AppModule {}
```

We need to import **GraphQLModule** in app.module.ts and tell it we're using code first;

```ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppService } from './app.service';
import { CountryModule } from './country/country.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
    }),
    CountryModule,
  ],
  providers: [AppService],
})
export class AppModule {}
```

Let's run with `yarn start:dev`. If everything goes well, your app should be running and schema file should be generated;

_src/schema.gql_

```json
# ------------------------------------------------------
# THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
# ------------------------------------------------------

type Country {
  """Example field (placeholder)"""
  exampleField: Int!
}

type Query {
  country(id: Int!): Country!
}

type Mutation {
  createCountry(createCountryInput: CreateCountryInput!): Country!
  updateCountry(updateCountryInput: UpdateCountryInput!): Country!
  removeCountry(id: Int!): Country!
}

input CreateCountryInput {
  """Example field (placeholder)"""
  exampleField: Int!
}

input UpdateCountryInput {
  """Example field (placeholder)"""
  exampleField: Int
  id: Int!
}

```

This is our schema file generated in SDL. As we proceed to created our resolvers, this file will be updated automatically.

Navigate to `http://localhost:3000/graphql`. NestJS uses [graphql playground](https://github.com/graphql/graphql-playground) by default. It's a lovely GraphQL IDE. We can check our schema here.

![playground-schema](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pu7ob86verdtzb9ct5v5.PNG)

# Complete GraphQL Schema

We have a basic GraphQL schema. Let's complete it with actual types. Initially, we'll create city and treaty modules as we did for country.

Run `nest g resource city --no-spec` & `nest g resource treaty --no-spec`. Note that, these two new modules are added to `app.module.ts`. Let's update country, city & treaty entities as below;

_src/country/entities/country.entity.ts_

```ts
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { City } from './../../city/entities/city.entity';
import { Treaty } from './../../treaty/entities/treaty.entity';

@ObjectType()
export class Country {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field(() => Int, { nullable: true })
  population: number;

  @Field(() => [City], { nullable: true })
  cities: City[];

  @Field(() => [Treaty], { nullable: true })
  treaties: Treaty[];

  @Field(() => City, { nullable: true })
  capital: City;
}
```

_src/city/entities/city.entity.ts_

```ts
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class City {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  touristic: boolean;

  @Field(() => Int, { nullable: true })
  population: number;
}
```

_src/treaty/entities/treaty.entity.ts_

```ts
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Country } from './../../country/entities/country.entity';

@ObjectType()
export class Treaty {
  @Field(() => Int)
  id: number;

  @Field({ nullable: false })
  name: string;

  @Field(() => [Country], { nullable: true })
  countries: Country[];
}
```

NestJS uses decorators to includes a class and its properties in GraphQL schema. `@ObjectType()` converts this class to schema type. `@Field()` decorator adds the selected property of the class to its parent schema type. While class itself is in typescript syntax, decorators use SDL syntax. Let's examine `Treaty` class;

```ts
 @Field(() => Int)
  id: number;
```

we use `number` for numeric datatypes in typescript. However, in GraphQL schema we want to make it an integer. So, in decorator we let NestJS know this.

GraphQL SDL has these scalar types
`Int`, `Float`, `String`, `Boolean`, `ID`

For the name field, on the other hand, we don't need to explicitly indicate an SDL type. GraphQL converts `string` to `String`. We can set some properties to fields. Here we set `{ nullable: false }`

```ts
  @Field({ nullable: false })
  name: string;
```

A treaty has joined countries. It's an array. Note that, we indicate an array of country differently in typescript & in SDL

```ts
  @Field(() => [Country], { nullable: true })
  countries: Country[];
```

Let's start the app and observe the schema update.

![updated-types](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/szfisto1awlcdb0xctkb.PNG)

# Adding TypeORM

Let's stop nestjs and install some packages;

`yarn add typeorm @nestjs/typeorm pg` we're using Postgresql. So, need to install `pg`. In the final part, we'll use mssql as well.

We can keep db connection params in `.env` file. This way, we can have our prod db params as environment variables in deployment environment.

_.env_

```
DB_NAME=countrydb
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
```

Now add type orm config file;

_ormconfig.js_

```js
module.exports = {
  name: 'countrydb',
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  entities: ['src/**/*entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
  logging: false,
  cli: {
    entitiesDir: 'src',
    migrationsDir: 'src/migrations',
  },
  options: { trustServerCertificate: true },
};
```

Nest is using naming conventions. If a file is an entity, nest name the file as `*.entity.ts`. In all three of our modules you can see them. In this config file we simply give the database connection info and also where to find the entities and where to create the migrations.

Note that, we'll be using our entities as graphql schema models and also as our db models. It's very nice not to create different models for both purposes. To achieve this, we need to add typeorm decorators to our country, city and treaty entities;

todo/////\*tALK ABOUT entities and type orm decorators

# npm scripts for migrations

nestjs comes with ts-node installed. We'd want to create our migrations using our typescript entities. So, those three weird script should be added to package.json;

```json
    "migration:generate": "ts-node ./node_modules/typeorm/cli.js migration:generate -c countrydb -n ",
    "migration:run": "ts-node ./node_modules/typeorm/cli.js migration:run -c countrydb",
    "migration:revert": "ts-node ./node_modules/typeorm/cli.js migration:revert -c countrydb"
```

-c flag is for connection name. Since we'll add a second one, we had to name them.

We have three operations about migrations;

**migration**:generate, creates a new migration comparing the models current state and the databse schema

**migration:run**, executes the not-yet-executed migrations in the database. The ones already executed, have no effect.

**migration:revert**, reverts the final migration

Our entities decorated with typeorm decorators are as follows;

_src/city/entities/city.entity.ts_

```ts
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Country } from '../../country/entities/country.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class City {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  touristic: boolean;

  @Column({ nullable: true })
  @Field(() => Int, { nullable: true })
  population: number;

  @ManyToOne(() => Country, (country) => country.cities)
  @JoinColumn({ name: 'country_id' })
  country: Country;

  @Column({ type: 'int', name: 'country_id' })
  countryId: number;
}

}
```

_src/country/entities/country.entity.ts_

```ts
import { Field, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { City } from './../../city/entities/city.entity';
import { Treaty } from './../../treaty/entities/treaty.entity';

@Entity()
@ObjectType()
export class Country {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column({ type: 'int', nullable: true })
  @Field(() => Int, { nullable: true })
  population: number;

  @OneToMany(() => City, (city) => city.country)
  @Field(() => [City], { nullable: true })
  cities: City[];

  @ManyToMany(() => Treaty, (treaty) => treaty.countries, { cascade: true })
  @Field(() => [Treaty], { nullable: true })
  @JoinTable({
    name: 'country_treaty', // table name for the junction table of this relation
    joinColumn: {
      name: 'country_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'treaty_id',
      referencedColumnName: 'id',
    },
  })
  treaties: Treaty[];

  @OneToOne(() => City)
  @Field(() => City, { nullable: true })
  @JoinColumn({ name: 'capital_city_id' })
  capital: City;
}

}
```

_src/treaty/entities/treaty.entity.ts_

```ts
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from './../../country/entities/country.entity';

@Entity()
@ObjectType()
export class Treaty {
  @PrimaryGeneratedColumn()
  @Field(() => Int)
  id: number;

  @Column()
  @Field({ nullable: false })
  name: string;

  @ManyToMany(() => Country, (country) => country.treaties)
  @Field(() => [Country], { nullable: true })
  countries: Country[];
}

}
```

Currently we have an empty countrydb. Let's create our initial migration using `yarn migration:generate Init`. Now you must have a migration like below. First part is the timestamp and would change in each run.

_src/migrations/1634739033521-Init.ts_

```ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1634791876559 implements MigrationInterface {
  name = 'Init1634791876559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "treaty" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_7876e417863f6fa3c9a51d0d3eb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "country" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "population" integer, "capital_city_id" integer, CONSTRAINT "REL_f3e41ef5df2a6a975986042fdf" UNIQUE ("capital_city_id"), CONSTRAINT "PK_bf6e37c231c4f4ea56dcd887269" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "city" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "touristic" boolean, "population" integer, "country_id" integer NOT NULL, CONSTRAINT "PK_b222f51ce26f7e5ca86944a6739" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "country_treaty" ("country_id" integer NOT NULL, "treaty_id" integer NOT NULL, CONSTRAINT "PK_3e59c9693b624da2b8779527a10" PRIMARY KEY ("country_id", "treaty_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_2010956a26a968fa554b6eb759" ON "country_treaty" ("country_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0ff0d4a234014c46946032aa42" ON "country_treaty" ("treaty_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "country" ADD CONSTRAINT "FK_f3e41ef5df2a6a975986042fdf9" FOREIGN KEY ("capital_city_id") REFERENCES "city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" ADD CONSTRAINT "FK_08af2eeb576770524fa05e26f39" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "country_treaty" ADD CONSTRAINT "FK_2010956a26a968fa554b6eb7598" FOREIGN KEY ("country_id") REFERENCES "country"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "country_treaty" ADD CONSTRAINT "FK_0ff0d4a234014c46946032aa421" FOREIGN KEY ("treaty_id") REFERENCES "treaty"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "country_treaty" DROP CONSTRAINT "FK_0ff0d4a234014c46946032aa421"`,
    );
    await queryRunner.query(
      `ALTER TABLE "country_treaty" DROP CONSTRAINT "FK_2010956a26a968fa554b6eb7598"`,
    );
    await queryRunner.query(
      `ALTER TABLE "city" DROP CONSTRAINT "FK_08af2eeb576770524fa05e26f39"`,
    );
    await queryRunner.query(
      `ALTER TABLE "country" DROP CONSTRAINT "FK_f3e41ef5df2a6a975986042fdf9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_0ff0d4a234014c46946032aa42"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_2010956a26a968fa554b6eb759"`,
    );
    await queryRunner.query(`DROP TABLE "country_treaty"`);
    await queryRunner.query(`DROP TABLE "city"`);
    await queryRunner.query(`DROP TABLE "country"`);
    await queryRunner.query(`DROP TABLE "treaty"`);
  }
}
```

You can run it with `yarn migration:run`. After this, our db is supposed to have `country`, `city`, `treaty`, `country-treaty` and `migrations` tables. migrations table keeps track of your migrations. It now has one record. More to come soon!

```
id|timestamp    |name             |
--+-------------+-----------------+
 2|1634739033521|Init1634739033521|
```

For our nest application to start, we need to supply TypeORM connection data from environment variables to `app.module.js`. First install nest config module;

`yarn add @nestjs/config` and update app.module.ts;

_src/app.module.ts_

```ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AppService } from './app.service';
import { CountryModule } from './country/country.module';
import { CityModule } from './city/city.module';
import { TreatyModule } from './treaty/treaty.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './country/entities/country.entity';
import { City } from './city/entities/city.entity';
import { Treaty } from './treaty/entities/treaty.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
    }),
    TypeOrmModule.forRoot({
      name: 'countrydb',
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [Country, City, Treaty],
      //logging: true,
    }),
    CountryModule,
    CityModule,
    TreatyModule,
  ],
  providers: [AppService],
})
export class AppModule {}
```

`logging` is very useful to see generated SQL commands.

Let's start the app. You should have all green;

![success-start](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/dog6z94de5t6xevh3iiq.PNG)

# Resolvers...

Query & mutation declarations reside in resolver files. They construct our GraphQL schema.

_src/city/city.resolver.ts_

```ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CityService } from './city.service';
import { City } from './entities/city.entity';
import { CreateCityInput } from './dto/create-city.input';
import { UpdateCityInput } from './dto/update-city.input';

@Resolver(() => City)
export class CityResolver {
  constructor(private readonly cityService: CityService) {}

  @Mutation(() => City)
  createCity(@Args('input') input: CreateCityInput) {
    return this.cityService.create(input);
  }

  @Query(() => [City], { name: 'cities' })
  findAll() {
    return this.cityService.findAll();
  }

  @Query(() => City, { name: 'city' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.cityService.findOne(id);
  }

  @Mutation(() => City)
  updateCity(@Args('input') input: UpdateCityInput) {
    return this.cityService.update(input);
  }

  @Mutation(() => Int, { nullable: true })
  removeCity(@Args('id', { type: () => Int, nullable: false }) id: number) {
    return this.cityService.remove(id);
  }
}
```

_src/country/country.resolver.ts_

```ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CountryService } from './country.service';
import { Country } from './entities/country.entity';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';

@Resolver(() => Country)
export class CountryResolver {
  constructor(private readonly countryService: CountryService) {}

  @Mutation(() => Country)
  createCountry(
    @Args('input', { nullable: false })
    input: CreateCountryInput,
  ) {
    return this.countryService.create(input);
  }

  @Query(() => [Country], { name: 'countries' })
  findAll() {
    return this.countryService.findAll();
  }

  @Query(() => Country, { name: 'country' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.countryService.findOne(id);
  }

  @Mutation(() => Country)
  updateCountry(@Args('input') input: UpdateCountryInput) {
    return this.countryService.update(input);
  }

  @Mutation(() => Int, { nullable: true })
  removeCountry(@Args('id', { type: () => Int, nullable: false }) id: number) {
    return this.countryService.remove(id);
  }

  @Mutation(() => Country, { name: 'addCountryToTreaty' })
  addToTreaty(
    @Args('countryId', { type: () => Int, nullable: false }) countryId: number,
    @Args('treatyId', { type: () => Int, nullable: false }) treatyId: number,
  ) {
    return this.countryService.addToTreaty(countryId, treatyId);
  }
  @Mutation(() => Country, { name: 'removeCountryFromTreaty' })
  removeFromTreaty(
    @Args('countryId', { type: () => Int, nullable: false }) countryId: number,
    @Args('treatyId', { type: () => Int, nullable: false }) treatyId: number,
  ) {
    return this.countryService.removeFromTreaty(countryId, treatyId);
  }
}
```

_src/treaty/treaty.resolver.ts_

```ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TreatyService } from './treaty.service';
import { Treaty } from './entities/treaty.entity';
import { CreateTreatyInput } from './dto/create-treaty.input';
import { UpdateTreatyInput } from './dto/update-treaty.input';

@Resolver(() => Treaty)
export class TreatyResolver {
  constructor(private readonly treatyService: TreatyService) {}

  @Mutation(() => Treaty)
  createTreaty(@Args('input') input: CreateTreatyInput) {
    return this.treatyService.create(input);
  }

  @Query(() => [Treaty], { name: 'treaties' })
  findAll() {
    return this.treatyService.findAll();
  }

  @Query(() => Treaty, { name: 'treaty' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.treatyService.findOne(id);
  }

  @Mutation(() => Treaty)
  updateTreaty(@Args('input') input: UpdateTreatyInput) {
    return this.treatyService.update(input);
  }

  @Mutation(() => Treaty)
  removeTreaty(@Args('id', { type: () => Int }) id: number) {
    return this.treatyService.remove(id);
  }
}
```

Query & mutations are not supposed to contain business logic. Theye are rather like façades to services which contains actual logic. This pattern is very useful as you may need to trigger your logic for somewhere other than query or mutation resolvers, such as background jobs.

Please note that we're injecting services in resolvers constructor. Nestjs has dependency injection out of the box. Writing tests are quite easy this way.

# Services

_src/city/city.service.ts_

```ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCityInput } from './dto/create-city.input';
import { UpdateCityInput } from './dto/update-city.input';
import { City } from './entities/city.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City, 'countrydb') private cityRepo: Repository<City>,
  ) {}

  async create(input: CreateCityInput): Promise<City> {
    return await this.cityRepo.save(input);
  }

  async findAll(): Promise<City[]> {
    return await this.cityRepo.find();
  }

  async findOne(id: number): Promise<City> {
    return await this.cityRepo.findOne(id);
  }

  async update(input: UpdateCityInput): Promise<City> {
    let found = await this.cityRepo.findOne(input.id);
    return await this.cityRepo.save({ ...found, ...input });
  }

  async remove(id: number) {
    let found = await this.cityRepo.findOne(id);
    if (found) {
      await this.cityRepo.remove(found);
      return id;
    } else {
      return null;
    }
  }
}
```

_src/country/country.service.ts_

```ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Treaty } from 'src/treaty/entities/treaty.entity';
import { Repository } from 'typeorm';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';
import { Country } from './entities/country.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country, 'countrydb')
    private countryRepo: Repository<Country>,
    @InjectRepository(Treaty, 'countrydb')
    private treatyRepo: Repository<Treaty>,
  ) {}

  async create(input: CreateCountryInput): Promise<Country> {
    return await this.countryRepo.save(input);
  }

  async findAll(): Promise<Country[]> {
    return await this.countryRepo.find({ relations: ['cities', 'treaties'] });
  }

  async findOne(id: number): Promise<Country> {
    return await this.countryRepo.findOne(id);
  }

  async update(input: UpdateCountryInput): Promise<Country> {
    let found = await this.countryRepo.findOne(input.id);
    return await this.countryRepo.save({ ...found, ...input });
  }

  async remove(id: number) {
    let found = await this.countryRepo.findOne(id);
    if (found) {
      await this.countryRepo.remove(found);
      return id;
    } else {
      return null;
    }
  }

  async addToTreaty(countryId: number, treatyId: number): Promise<Country> {
    let foundCountry = await this.countryRepo.findOne(
      { id: countryId },
      { relations: ['treaties'] },
    );
    let foundTreaty = await this.treatyRepo.findOne({ id: treatyId });

    if (foundCountry && foundTreaty) {
      foundCountry.treaties = foundCountry.treaties
        ? [...foundCountry.treaties, foundTreaty]
        : [foundTreaty];

      return this.countryRepo.save(foundCountry);
    } else {
      throw new Error(`Founding country or treaty problem`);
    }
  }

  async removeFromTreaty(
    countryId: number,
    treatyId: number,
  ): Promise<Country> {
    let foundCountry = await this.countryRepo.findOne(
      { id: countryId },
      { relations: ['treaties'] },
    );
    let foundTreaty = await this.treatyRepo.findOne({ id: treatyId });

    if (foundCountry && foundTreaty) {
      foundCountry.treaties = foundCountry.treaties
        ? [...foundCountry.treaties.filter((f) => f.id != treatyId)]
        : [];

      return this.countryRepo.save(foundCountry);
    } else {
      throw new Error(`Founding country or treaty problem`);
    }
  }
}
```

_src/treaty/treaty.service.ts_

```ts
import { Treaty } from './entities/treaty.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTreatyInput } from './dto/create-treaty.input';
import { UpdateTreatyInput } from './dto/update-treaty.input';

@Injectable()
export class TreatyService {
  constructor(
    @InjectRepository(Treaty, 'countrydb')
    private treatyRepo: Repository<Treaty>,
  ) {}

  async create(input: CreateTreatyInput): Promise<Treaty> {
    return await this.treatyRepo.save(input);
  }

  async findAll(): Promise<Treaty[]> {
    return await this.treatyRepo.find({ relations: ['countries'] });
  }

  async findOne(id: number): Promise<Treaty> {
    return await this.treatyRepo.findOne(id);
  }

  async update(input: UpdateTreatyInput): Promise<Treaty> {
    let found = await this.treatyRepo.findOne(input.id);
    return await this.treatyRepo.save({ ...found, ...input });
  }

  async remove(id: number) {
    let found = await this.treatyRepo.findOne(id);
    if (found) {
      await this.treatyRepo.remove(found);
      return id;
    } else {
      return null;
    }
  }
}
```

As seen above, all our logic is in services. Please note that we're injecting db entity repositories in service constructors. `@nestjs/typeorm` wrapper makes it possible, wonderful!

# Input types

Our last graphql schema element is input. We receive everything from GraphQL schema as strict types. In addition, what we supply to it is supposed to be schema type as well. To achive this, we're decorating our input classes with `@InputType()` from `@nestjs/graphql` wrapper. Nest automatically generated `dto` directories in our modules. We decorate its fields similarly with `@Field()`. Let's see city module inputs;

_src/city/dto/create-city.input.ts_

```ts
import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCityInput {
  @Field({ nullable: false })
  name: string;

  @Field(() => Int, { nullable: true })
  population: number;

  @Field(() => Int, { nullable: false })
  countryId: number;
}
```

_src/city/dto/update-city.input.ts_

```ts
import { CreateCityInput } from './create-city.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCityInput extends PartialType(CreateCityInput) {
  @Field(() => Int, { nullable: false })
  id: number;
}
```

update input extends create input and adds a mandatory id field.

# Let's give it a try...

We'll use graphql playground in `http://localhost:3000`. First, query countries;

```graphql
query countries {
  countries {
    id
    name
    population
    treaties {
      id
      name
    }
  }
}
```

And the reply from graphql is empty since we've not yet created any. Let's create three countries;

```graphql
mutation createCountry {
  createCountry(input: { name: "Japan", population: 35000 }) {
    id
    name
  }
}
```

```graphql
mutation createCountry {
  createCountry(input: { name: "France", population: 25000 }) {
    id
    name
  }
}
```

```graphql
mutation createCountry {
  createCountry(input: { name: "Germany", population: 55000 }) {
    id
    name
  }
}
```

Now run the countries query again, you must have three now;

```
{
  "data": {
    "countries": [
      {
        "id": 2,
        "name": "France",
        "population": 25000,
        "treaties": []
      },
      {
        "id": 1,
        "name": "Japan",
        "population": 35000,
        "treaties": []
      },
      {
        "id": 3,
        "name": "Germany",
        "population": 55000,
        "treaties": []
      }
    ]
  }
}
```

it's important to note that, the shape of the result determined by the query we sent. You can test all the mutations and queries your self. There're all functional!

# Adding continent field to country

Let's say we need to add a continent field to country. Moreover, since continent data is not to subject to change, we want the continent to be enum. Let's create `Continent` enum;

_src/country/enums.ts_

```ts
import { registerEnumType } from '@nestjs/graphql';

export enum Continent {
  Asia = 'Asia',
  Europe = 'Europe',
  America = 'America',
  Africa = 'Africa',
}

registerEnumType(Continent, { name: 'Continent' });
```

We need to register enums with `registerEnumType`. Let's add below field to country entity;

```ts
  @Column({ type: 'enum', enum: Continent, nullable: true })
  @Field(() => Continent, { nullable: true })
  continent: Continent;
```

We're using the same enum for our db, and also for our graphql schema, awesome! Finally we need to update `CreateCountryInput` with below field;

```ts
  @Field(() => Continent, { nullable: true })
  continent: Continent;
```

Now we should create a new typeorm db migration to update countrydb accordingly; `yarn migration:generate Continent`. Our second migration should be like this;

```ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Continent1634807399486 implements MigrationInterface {
  name = 'Continent1634807399486';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."country_continent_enum" AS ENUM('Asia', 'Europe', 'America', 'Africa')`,
    );
    await queryRunner.query(
      `ALTER TABLE "country" ADD "continent" "public"."country_continent_enum"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "country" DROP COLUMN "continent"`);
    await queryRunner.query(`DROP TYPE "public"."country_continent_enum"`);
  }
}
```

Only necessary DDL commands are added to newly created migration. We're updating our db incrementally. We can have our migrations to execute manually added DML commands. Our treaty table is empty. Let's insert some;

```ts
import { MigrationInterface, QueryRunner } from 'typeorm';

export class Continent1634807399486 implements MigrationInterface {
  name = 'Continent1634807399486';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."country_continent_enum" AS ENUM('Asia', 'Europe', 'America', 'Africa')`,
    );
    await queryRunner.query(
      `ALTER TABLE "country" ADD "continent" "public"."country_continent_enum"`,
    );

    await queryRunner.query(
      `INSERT INTO "treaty"(name) VALUES ('Kyoto Protocol'),('Paris Agreement'),('Vienna Convention');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "country" DROP COLUMN "continent"`);
    await queryRunner.query(`DROP TYPE "public"."country_continent_enum"`);
    await queryRunner.query(`DELETE FROM "treaty"`);
  }
}
```

We've added insert and delete DML commands to `up` and `down` functions of Continent migration respectively. Let's run it, `yarn migration:run`

Country table is supposed to have a `continent` field of type `country_continent_enum`. Besides, `treaty` table must have three records inserted. We can see Continent enum in our graphql schema;

![enum](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/txfoviy9vrejmu5mdqfy.PNG)

Let's check `migrations` table. It now has a new record of Continent migration. This way we're versioning countrydb. When we deploy our code to prod, our prod countrydb migration level will be updated and we can trace it easily. No manuel DDL update would be necessary, wonderful!

```
id|timestamp    |name                  |
--+-------------+----------------------+
 1|1634791876559|Init1634791876559     |
 2|1634807399486|Continent1634807399486|
```

We can update the countries with continent. Since it's enum type, no need to write, just hit ctrl+space and select from continents, nice!

```graphql
mutation updateCountry {
  updateCountry(input: { id: 1, continent: Asia }) {
    id
    name
    continent
  }
}
```

# Query a legacy database

We may need to query an existing legacy database. It'll be a db first approach. So, we'll create its module, service, resolver one by one;

`nest g module legacy --no-spec`

`nest g service legacy --no-spec`

`nest g resolver legacy --no-spec`

Our legacydb is a mssql. Need to install mssql package

`yarn add mssql`

We need to add one more `TypeOrmModule` among app module's imports array;

```ts
 TypeOrmModule.forRoot({
      name: 'legacydb',
      type: 'mssql',
      host: process.env.LEGACY_DB_HOST,
      port: parseInt(process.env.LEGACY_DB_PORT),
      username: process.env.LEGACY_DB_USERNAME,
      password: process.env.LEGACY_DB_PASSWORD,
      database: process.env.LEGACY_DB_NAME,
      extra: {
        trustServerCertificate: true,
      },
    }),

```

new `.env` file should be as below;

```
DB_NAME=countrydb
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
LEGACY_DB_HOST=localhost\SQLEXPRESS
LEGACY_DB_PORT=1433
LEGACY_DB_USERNAME=dummy_user
LEGACY_DB_PASSWORD=dummy_password
LEGACY_DB_NAME=legacydb
```

Let's say legacydb has a `company` table which we'll query from;

```
id|name     |products             |
--+---------+---------------------+
 1|Apple    |iphone, ipad, macbook|
 2|Samsung  |Android devices      |
 3|Del Monte|Food                 |
 4|Tesla    |Electric cars        |
```

Let's create a dto object to be used as result type of our query;

_src/legacy/dto/legacy.company.ts_

```ts
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Company {
  @Field(() => Int, { nullable: true })
  id: number;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  products: string;
}
```

_src/legacy/legacy.service.ts_

```ts
import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';
import { Company } from './dto/legacy.company';

@Injectable()
export class LegacyService {
  async findCompanies(companyName: string): Promise<Company[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const entityManager = getManager('legacydb');
        let strQueryCompany = `SELECT id, name, products FROM legacydb.dbo.company WHERE name = @0;`;

        let result = await entityManager.query(strQueryCompany, [companyName]);

        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }
}
```

_src/legacy/legacy.resolver.ts_

```ts
import { LegacyService } from './legacy.service';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Company } from './dto/legacy.company';

@Resolver()
export class LegacyResolver {
  constructor(private legacyService: LegacyService) {}

  @Query(() => [Company])
  async companies(
    @Args('companyName', { nullable: true }) companyName: string,
  ) {
    return await this.legacyService.findCompanies(companyName);
  }
}
```

We can see our `Company` type and `companies` query in graphql schema;

![company-schema](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pnaxne32gwnrcu2m2mxj.PNG)

Our query is supposed to run as below;

![company-query](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/4y4ef6gfgzoa165xz89d.PNG)

Finally, we're querying two databases from the same graphql api 👍
