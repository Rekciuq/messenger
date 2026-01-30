import { ref, customRef, watch } from "vue";
import type { Ref } from "vue";
import debounce from "lodash/debounce";

export function useDebouncedValue<T>(
  initialValue: T,
  delay: number = 500,
): Ref<T> {
  const state = ref(initialValue) as Ref<T>;
  const debouncedState = ref(initialValue) as Ref<T>;

  const updateDebouncedValue = debounce((value: T) => {
    debouncedState.value = value;
  }, delay);

  watch(state, (newValue) => {
    updateDebouncedValue(newValue);
  });

  return customRef((track, trigger) => ({
    get() {
      track();
      return state.value;
    },
    set(value: T) {
      state.value = value;
      trigger();
      updateDebouncedValue(value);
    },
  }));
}

export function useDebouncedRef<T>(
  initialValue: T,
  delay: number = 500,
): { value: Ref<T>; debouncedValue: Ref<T> } {
  const value = ref(initialValue) as Ref<T>;
  const debouncedValue = ref(initialValue) as Ref<T>;

  const updateDebouncedValue = debounce((newValue: T) => {
    debouncedValue.value = newValue;
  }, delay);

  watch(value, (newValue) => {
    updateDebouncedValue(newValue);
  });

  return {
    value,
    debouncedValue,
  };
}
