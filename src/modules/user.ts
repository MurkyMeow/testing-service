import { Field, ID, ObjectType, Resolver, Query, Arg, Ctx, Mutation, registerEnumType } from 'type-graphql';
import { Context } from '../server';
import { User, Role } from '../entity/user';

registerEnumType(Role, { name: 'Role' });

@ObjectType()
class UserType {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => Role)
  role: Role;
}

@Resolver(UserType)
export class UserResolver {
  @Query(() => UserType)
  async self(@Ctx() { ctx }: Context) {
    ctx.assert(ctx.session.user, 401);
    const user = await User.findOne(ctx.session.user.id);
    return user;
  }

  @Query(() => Boolean)
  signout(@Ctx() { ctx }: Context): Boolean {
    ctx.assert(ctx.session.user, 401);
    ctx.session.user = null;
    return true;
  }

  @Mutation(() => Boolean)
  async signup(
    @Arg('email') email: string,
    @Arg('name') name: string,
    @Arg('password') password: string,
    @Ctx() { ctx }: Context
  ) {
    const user = await User.findOne({
      where: { email }
    });
    ctx.assert(!user, 409, 'That email is busy');
    const newUser = User.create({
      role: Role.user, name, email, password,
    });
    await newUser.save();
    return true;
  }

  @Query(() => UserType)
  async signin(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { ctx }: Context
  ) {
    const user = await User.findOne({
      where: { email }
    });
    const match = user && user.comparePassword(password);
    ctx.assert(match, 403, 'Invalid login');
    ctx.session.user = user;
    return user;
  }
}
