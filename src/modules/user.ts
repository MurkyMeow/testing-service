import bcrypt from 'bcrypt';
import { Resolver, Query, Arg, Ctx, Mutation, registerEnumType, Int, InputType, Field } from 'type-graphql';
import { Context, assert } from '../server';
import { User, Role } from '../entity/user';

registerEnumType(Role, { name: 'Role' });

@InputType()
class EditProfileInput {
  @Field()
  name!: string;
}

@Resolver(User)
export class UserResolver {
  @Query(() => User)
  self(@Ctx() { session }: Context) {
    return assert(session.user, 401);
  }

  @Query(() => User)
  async getProfile(
    @Arg('id', () => Int) id: number,
  ): Promise<User> {
    return assert(await User.findOne(id), 404);
  }

  @Query(() => [User])
  async getProfilesByRole(
    @Ctx() { session }: Context,
    @Arg('role', () => Role) role: Role,
  ): Promise<User[]> {
    const user = assert(session.user, 401);
    assert(user.role === Role.admin, 403);
    return User.find({ where: { role } });
  }

  @Mutation(() => User)
  async changeUserRole(
    @Ctx() { session }: Context,
    @Arg('id', () => Int) id: number,
    @Arg('role', () => Role) role: Role,
  ): Promise<User> {
    const user = assert(session.user, 401);
    assert(user.role === Role.admin, 403);

    const target = assert(await User.findOne(id), 404);
    target.role = role;
    return target.save();
  }

  @Mutation(() => User)
  async editProfile(
    @Ctx() { session }: Context,
    @Arg('input', () => EditProfileInput) input: EditProfileInput,
  ): Promise<User> {
    const user = assert(session.user, 401);
    user.name = input.name;
    return user.save();
  }

  @Mutation(() => Boolean)
  signout(@Ctx() { session }: Context): boolean {
    assert(session.user, 401);
    delete session.user;
    return true;
  }

  @Mutation(() => User)
  async signup(
    @Arg('email') email: string,
    @Arg('name') name: string,
    @Arg('password') password: string,
  ): Promise<User> {
    const user = await User.findOne({ where: { email } });
    assert(!user, 409, 'That email is busy');
    const hash = await bcrypt.hash(password, 12);
    return User
      .create({ role: Role.user, name, email, password: hash })
      .save();
  }

  @Mutation(() => User)
  async signin(
    @Arg('email') email: string,
    @Arg('password') password: string,
    @Ctx() { session }: Context,
  ): Promise<User> {
    const user = assert(
      await User.findOne({ where: { email } }), 403, 'Invalid login');
    const match = await bcrypt.compare(password, user.password);
    assert(match, 403, 'Invalid login');
    session.user = user;
    return user;
  }
}
