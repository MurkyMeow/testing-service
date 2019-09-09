import { Resolver, Query, Arg, Ctx, Mutation } from 'type-graphql';
import { Context } from '../server';
import { Category } from '../entity/category';

@Resolver(Category)
export class CategoryResolver {
  @Query(() => [Category])
  getCategories(): Promise<Category[]> {
    return Category.find();
  }

  @Query(() => Category)
  async getCategory(
    @Arg('id') id: number,
    @Ctx() { assert }: Context
  ): Promise<Category> {
    return assert(await Category.findOne(id), 404);
  }

  @Mutation(() => Category)
  addCategory(
    @Arg('name') name: string,
    @Ctx() { session }: Context,
  ): Promise<Category> {
    return Category.create({ name, creator: session.user }).save();
  }

  @Mutation(() => Category)
  async editCategory(
    @Arg('id') id: number,
    @Arg('name') name: string,
    @Ctx() { session, assert }: Context,
  ): Promise<Category> {
    const category = assert(await Category.findOne(id), 404);
    const isCreator = session.user.id === category.creatorId;
    assert(isCreator, 403);
    category.name = name;
    return category.save();
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @Arg('id') id: number,
    @Ctx() { session, assert }: Context,
  ): Promise<boolean> {
    const category = assert(await Category.findOne(id), 404);
    assert(session.user.id === category.creatorId, 403);
    await category.remove();
    return true;
  }
}
