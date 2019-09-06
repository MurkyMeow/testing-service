import { User, Role } from '../entity/user';
import { Category } from '../entity/category';
import { req, getUser } from './setup';
import { Test } from '../entity/test';

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
    const login = req(signinQuery, { email: user.email, password: '____' });
    await expect(login).rejects.toBeDefined();
  });
});

describe('category resolvers', () => {
  it('adds a category', async () => {
    const user = await getUser();
    const res = await req(addCategoryMutation, { name: 'test' }, user);
    expect(res.data).toBeTruthy();
    expect(res.data.addCategory.name).toEqual('test');
  });
  it('edits a category', async () => {
    const user = await getUser();
    await Category.create({ name: '_', creatorId: user.id }).save();
    const res = await req(editCategoryMutation, { id: 1, name: 'test' }, user);
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

const addTestMutation = `
  mutation($categoryId: Int!, $name: String!, $questions: [QuestionInput!]!) {
    addTest(categoryId: $categoryId, name: $name, questions: $questions) {
      name
      questions {
        text
        answers {
          text
          correct
        }
      }
    }
  }
`;
const editTestMutation = `
  mutation($id: Int!, $name: String!, $questions: [QuestionInput!]!) {
    editTest(id: $id, name: $name, questions: $questions) {
      id
      name
      questions {
        id
        text
        answers {
          id
          text
          correct
        }
      }
    }
  }
`;
const deleteTestMutation = `
  mutation($id: Int!) {
    deleteTest(id: $id)
  }
`;

describe('test resolvers', () => {
  const category = {
    creatorId: 1,
    name: 'a category',
  };
  const test = {
    categoryId: 1,
    creatorId: 1,
    name: 'a test',
    questions: [
      {
        text: 'foo?',
        answers: [{ text: 'bar', correct: true }],
      },
      {
        text: 'baz?',
        answers: [{ text: 'qux', correct: true }],
      },
    ],
  };
  it('adds a test', async () => {
    const user = await getUser();
    await Category.insert(category);
    const res = await req(addTestMutation, test, user);
    const { creatorId, categoryId, ...rest } = test;
    expect(res.data.addTest).toMatchObject(rest);
    const dbtest = await Test.findOne({
      relations: ['questions', 'questions.answers'],
    });
    expect(dbtest).toMatchObject(rest);
  });
  it('edits a test', async () => {
    const user = await getUser();
    await Category.create(category).save();
    await Test.create(test).save();
    const patch = {
      id: 1,
      name: 'updated',
      questions: [
        {
          text: 'car?',
          answers: [{ text: 'var', correct: true }],
        },
      ],
    };
    const res = await req(editTestMutation, patch, user);
    expect(res.data.editTest).toMatchObject(patch);
    const dbtest = await Test.findOne({
      relations: ['questions', 'questions.answers'],
    });
    expect(dbtest).toMatchObject(patch);
  });
  it('deletes a test', async () => {
    const user = await getUser();
    await Category.create(category).save();
    await Test.create(test).save();
    const res = await req(deleteTestMutation, { id: 1 }, user);
    expect(res.data.deleteTest).toBe(true);
    const tests = await Test.find();
    expect(tests).toHaveLength(0);
  });
});
