import { Resolver, Query, Arg, Ctx, Mutation, registerEnumType } from 'type-graphql';
import { Context } from '../server';
import { User, Role } from '../entity/user';

registerEnumType(Role, { name: 'Role' });

@Resolver(User)
export class UserResolver {
  @Query(() => User)
  async self(@Ctx() { ctx, assert }: Context) {
    assert(ctx.session.user, 401);
    const user = await User.findOne(ctx.session.user.id);
    return user;
  }

  @Query(() => Boolean)
  signout(@Ctx() { ctx, assert }: Context): Boolean {
    assert(ctx.session.user, 401);
    ctx.session.user = null;
    return true;
  }

  @Mutation(() => Boolean)
  async signup(
    @Arg('email') email: string,
    @Arg('name') name: string,
    @Arg('password') password: string,
    @Ctx() { assert }: Context
  ) {
    const user = await User.findOne({
      where: { email }
    });
    assert(!user, 409, 'That email is busy');
    const newUser = User.create({
      role: Role.user, name, email, password,
    });
    await newUser.save();
    return true;
  }

  @Query(() => User)
  async signin(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { ctx, assert }: Context
  ) {
    const user = await User.findOne({
      where: { email }
    });
    const match = user && user.comparePassword(password);
    assert(match, 403, 'Invalid login');
    ctx.session.user = user;
    return user;
  }
}
