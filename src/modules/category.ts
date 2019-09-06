import { Resolver, Query, Arg, Ctx, Mutation } from 'type-graphql';
import { Context } from '../server';
import { Category } from '../entity/category';

@Resolver(Category)
export class CategoryResolver {
  @Query(() => [Category])
  getCategories() {
    return Category.find();
  }

  @Query(() => Category)
  getCategory(@Arg('id') id: number) {
    return Category.findOne(id);
  }

  @Mutation(() => Category)
  addCategory(@Arg('name') name: string, @Ctx() { session }: Context) {
    return Category.create({ name, creator: session.user }).save();
  }

  @Mutation(() => Category)
  async editCategory(
    @Arg('id') id: number,
    @Arg('name') name: string,
    @Ctx() { session, assert }: Context
  ) {
    const category = await Category.findOne(id, {
      relations: ['creator'],
    });
    const isCreator = session.user.id === category.creator.id;
    assert(isCreator, 403);
    category.name = name;
    return category.save();
  }

  @Mutation(() => Boolean)
  async deleteCategory(
    @Arg('id') id: number,
    @Ctx() { session, assert }: Context
  ) {
    const category = await Category.findOne(id, {
      relations: ['creator'],
    });
    assert(session.user.id === category.creator.id, 403);
    await category.remove();
    return true;
  }
}
