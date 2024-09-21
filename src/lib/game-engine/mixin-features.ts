type TypeError_MixinFunctionResultTypeDoesNotExtendFirstParameterType =
    "Mixin function result type does not extend first parameter type";
type TypeError_DoesNotAppearToBeAMixinFunction = "Does not appear to be a mixin function";

export type MixinFeatures<TFn extends (...args: any[]) => any> = TFn extends
    (src: infer TMinimum, ...rest: any[]) => infer TDst ? (TDst extends TMinimum ? Omit<TDst, keyof TMinimum>
        : TypeError_MixinFunctionResultTypeDoesNotExtendFirstParameterType)
    : TypeError_DoesNotAppearToBeAMixinFunction;
