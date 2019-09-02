import { gql } from 'apollo-server-koa';
import { Context } from '../server';
import { Category } from '../entity/category';

export const CategoryModule = {
  typeDefs: gql`
    extend type Query {
      getCategories: [Category]
    }
    extend type Mutation {
      addCategory(name: String!): Category
      deleteCategory(id: ID!): Boolean
      editCategory(id: ID!, name: String!): Category
    }
    type Category {
      id: ID!
      name: String!
    }
  `,
  resolvers: {
    Query: {
      getCategories: (): Promise<Category[]> => Category.find(),
    },
    Mutation: {
      async addCategory(_, { name }, { ctx }: Context): Promise<Category> {
        const category = new Category();
        category.name = name;
        category.creator = ctx.session.user;
        return category.save();
      },
      async editCategory(_, { id, name }, { ctx }: Context): Promise<Category> {
        const category = await Category.findOne(id, {
          relations: ['creator'],
        });
        const isCreator = ctx.session.user.id === category.creator.id;
        ctx.assert(isCreator, 403);
        category.name = name;
        return category.save();
      },
      async deleteCategory(_, { id }, { ctx }): Promise<boolean> {
        const category = await Category.findOne(id, {
          relations: ['creator'],
        });
        ctx.assert(ctx.session.user.id === category.creator.id, 403);
        await category.remove();
        return true;
      },
    },
  },
};
