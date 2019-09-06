import { User, Role } from '../entity/user';
import { Category } from '../entity/category';
import { req } from './setup';

const signupMutation = `
  mutation($email: String!, $name: String!, $password: String!) {
    signup(email: $email, name: $name, password: $password)
  }
`;
const signinQuery = `
  query($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
      role
    }
  }
`;
const addCategoryMutation = `
  mutation($name: String!) {
    addCategory(name: $name) {
      id
      name
    }
  }
`;
const editCategoryMutation = `
  mutation($id: Float!, $name: String!) {
    editCategory(id: $id, name: $name) {
      id
      name
    }
  }
`;
const getCategoriesQuery = `
  query {
    getCategories {
      id
      name
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
    expect(dbuser).toBeTruthy();
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
    expect(data.signin).toBeTruthy();
    expect(data.signin.name).toEqual(user.name);
    expect(data.signin.email).toEqual(user.email);
  });
  it('rejects invalid password', async () => {
    await User.create({ ...user, role: Role.user }).save();
    const { errors } = await req(signinQuery, {
      email: user.email,
      password: '____',
    });
    expect(errors).toBeTruthy();
    expect(errors[0].extensions.code).toEqual('403');
  });
});

describe('category resolvers', () => {
  it('adds a category', async () => {
    const res = await req(addCategoryMutation, { name: 'test' });
    expect(res.data).toBeTruthy();
    expect(res.data.addCategory.name).toEqual('test');
  });
  it('edits a category', async () => {
    await Category.create({ name: '_' }).save();
    const res = await req(editCategoryMutation, { id: 1, name: 'test' });
    expect(res.data).toBeTruthy();
    expect(res.data.editCategory.name).toEqual('test');
  });
  it('gets the list of categories', async () => {
    await Category.create({ name: 'a' }).save();
    await Category.create({ name: 'b' }).save();
    await Category.create({ name: 'c' }).save();
    const res = await req(getCategoriesQuery);
    expect(res.data).toBeTruthy();
    expect(res.data.getCategories).toHaveLength(3);
  });
});
