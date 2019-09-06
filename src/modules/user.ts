import { Resolver, Query, Arg, Ctx, Mutation, registerEnumType } from 'type-graphql';
import { Context } from '../server';
import { User, Role } from '../entity/user';

registerEnumType(Role, { name: 'Role' });

@Resolver(User)
export class UserResolver {
  @Query(() => User)
  self(@Ctx() { session, assert }: Context) {
    assert(Boolean(session.user), 401);
    return session.user;
  }

  @Query(() => Boolean)
  signout(@Ctx() { session, assert }: Context): Boolean {
    assert(Boolean(session.user), 401);
    session.user = null;
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
    @Ctx() { session, assert }: Context
  ) {
    const user = await User.findOne({
      where: { email }
    });
    const match = user && user.comparePassword(password);
    assert(match, 403, 'Invalid login');
    session.user = user;
    return user;
  }
}
