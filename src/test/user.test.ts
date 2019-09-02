import { User, Role } from '../entity/user';
import { req } from './setup';

const signupMutation = `
  mutation SignupMutation($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password)
  }
`;
const signinQuery = `
  query SigninQuery($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
      role
    }
  }
`;

describe('user resolvers', () => {
  const user = {
    email: 'hello@world',
    name: 'hello',
    password: 'world',
  };
  it('creates an account', async () => {
    const { data } = await req(signupMutation, user);
    expect(data.signup).toEqual(true);

    const dbuser = await User.findOne();
    expect(dbuser).toBeDefined();
    expect(dbuser.name).toEqual(user.name);
    expect(dbuser.email).toEqual(user.email);
    expect(dbuser.role).toEqual(Role.user);
  });
  it('signs in', async () => {
    await User.create({ ...user, role: Role.user }).save();
    const { data } = await req(signinQuery, {
      email: user.email,
      password: user.password,
    });
    expect(data.signin).toBeDefined();
    expect(data.signin.name).toEqual(user.name);
    expect(data.signin.email).toEqual(user.email);
  });
});
