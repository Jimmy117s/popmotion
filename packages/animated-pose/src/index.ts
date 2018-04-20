import { Animated } from 'react-native';
import poseFactory, { Poser, PoserConfig } from 'pose-core';
import defaultTransitions from './inc/default-transitions';
import { Value, Action, CreateValueProps, AnimatedPoser } from './types';

const pose = poseFactory<Value, Action, AnimatedPoser>({
  /**
   * Bind onChange callbacks
   */
  bindOnChange: (values, onChange) => key => {
    if (!values.has(key)) return;

    const { raw } = values.get(key);
    if (raw) raw.addListener(onChange[key]);
  },

  /**
   * Read value
   *
   * In Animated, `getValue` is a private function. We don't need to read it
   * either as we can simply create a new value using the `Value.interpolate` method.
   */
  readValue: () => 0,

  /**
   * Create value
   *
   * If we've got `passive` props, we simply return an `interpolate` value.
   * If we're creating a new value, we check if its a string (therefore a
   * value with a unit) and create both a value and an interpolated value
   */
  createValue: (
    init,
    { passiveParent, passiveProps }: CreateValueProps = {}
  ) => {
    if (passiveParent) {
      return { interpolation: passiveParent.raw.interpolate(passiveProps) };
    } else {
      const needsInterpolation = typeof init === 'string';
      const initValue = needsInterpolation ? parseFloat(init) : init;
      const value: Value = {
        raw: new Animated.Value(initValue)
      };

      if (needsInterpolation) {
        const unit = init.replace(init.match(/\d+/)[0], '');
        value.interpolation = value.raw.interpolate({
          inputRange: [0, 360],
          outputRange: [`0${unit}`, `360${unit}`]
        });
      }

      return value;
    }
  },

  /**
   * Get props to pass to a pose's `transition` method and dynamic props
   */
  getTransitionProps: ({ raw }, toValue) => ({
    value: raw,
    toValue
  }),

  /**
   * Resolve target as a number.
   */
  resolveTarget: ({ interpolation }, target) =>
    interpolation ? parseFloat(target) : target,

  /**
   * Select, from our `Value` type, the value to pass when a user calls `poser.get(key)`
   * We pass the interpolated value (passive or output with unit) if it exists, otherwise
   * we return the raw Value
   */
  selectValueToRead: ({ raw, interpolation }) => interpolation || raw,

  /**
   * Start the Animated animation
   */
  startAction: (action, onComplete) => {
    action.start(onComplete as Animated.EndCallback);
    return action;
  },

  /**
   * Stop an Animated animation
   */
  stopAction: action => action.stop(),

  /**
   * Create a transition that instantly switches one value to another
   */
  getInstantTransition: (value, toValue) =>
    Animated.timing(value.raw, {
      toValue,
      duration: 0
    }),

  /**
   * Take an existing animation and return it composed with a delay
   */
  addActionDelay: (delay = 0, transition) =>
    Animated.sequence([Animated.delay(delay), transition]),

  /**
   * Map of default transitions keyed by pose name. Animated Pose currently
   * only supports animations (rather than dragging etc) so it only includes "default"
   */
  defaultTransitions,

  /**
   * Return the Poser API returned by the factory function, with extra methods
   * specific to Animated Pose
   */
  extendAPI: api => {
    return {
      ...api,
      addChild: (props: PoserConfig<Value>) => {
        return api._addChild(props, pose);
      }
    };
  }
});

export default pose;
export { Poser };
