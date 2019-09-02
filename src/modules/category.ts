import { Field, ID, ObjectType, Resolver, Query, Arg, Ctx, Mutation } from 'type-graphql';
import { Context } from '../server';
import { Category } from '../entity/category';

@ObjectType()
class CategoryType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}

@Resolver(CategoryType)
export class CategoryResolver {
  @Query(() => CategoryType)
  async addCategory(@Arg('name') name: string, @Ctx() { ctx }: Context) {
    const category = new Category();
    category.name = name;
    category.creator = ctx.session.user;
    return category.save();
  }

  @Mutation(() => CategoryType)
  async editCategory(@Arg('id') id: number, @Arg('name') name: string, @Ctx() { ctx }: Context) {
    const category = await Category.findOne(id, {
      relations: ['creator'],
    });
    const isCreator = ctx.session.user.id === category.creator.id;
    ctx.assert(isCreator, 403);
    category.name = name;
    return category.save();
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Arg('id') id: number, @Ctx() { ctx }: Context) {
    const category = await Category.findOne(id, {
      relations: ['creator'],
    });
    ctx.assert(ctx.session.user.id === category.creator.id, 403);
    await category.remove();
    return true;
  }
}
