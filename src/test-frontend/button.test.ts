import { shallowMount } from '@vue/test-utils';
import Button from '../components/button.vue';

describe('Button', () => {
  it('renders slot', () => {
    const msg = 'new msg';
    const wrapper = shallowMount(Button, {
      slots: { default: msg },
    });
    expect(wrapper.text()).toBe(msg);
  });
});
