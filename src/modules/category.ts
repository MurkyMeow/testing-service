import { Resolver, Query, Arg, Ctx, Mutation, Int } from 'type-graphql';
import { Context, assert } from '../server';
import { Category } from '../entity/category';

@Resolver(Category)
export class CategoryResolver {
  @Query(() => [Category])
  getCategories(): Promise<Category[]> {
    return Category.find();
  }

  @Query(() => Category)
  async getCategory(
    @Arg('id', () => Int) id: number,
  ): Promise<Category> {
    return assert(await Category.findOne(id), 404);
  }

  @Mutation(() => Category)
  addCategory(
    @Arg('name') name: string,
    @Ctx() { session }: Context,
  ): Promise<Category> {
    const creator = assert(session.user, 401);
    return Category.create({ name, creator }).save();
  }

  @Mutation(() => Category)
  async editCategory(
    @Arg('id', () => Int) id: number,
    @Arg('name') name: string,
    @Ctx() { session }: Context,
  ): Promise<Category> {
    const user = assert(session.user, 401);
    const category = assert(await Category.findOne(id), 404);
    assert(user.id === category.creatorId, 403);
    category.name = name;
    return category.save();
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @Arg('id', () => Int) id: number,
    @Ctx() { session }: Context,
  ): Promise<boolean> {
    const user = assert(session.user, 401);
    const category = assert(await Category.findOne(id), 404);
    assert(user.id === category.creatorId, 403);
    await category.remove();
    return true;
  }
}
