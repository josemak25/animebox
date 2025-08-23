import React, { PropsWithChildren, ComponentType } from "react";

// Strongly typed provider tuple
type ProviderTuple<P = object> =
  | ComponentType<PropsWithChildren<P>>
  | [ComponentType<PropsWithChildren<P>>, P]
  | [ComponentType<PropsWithChildren<P>>, P, ComponentType];

type ProvidersArray = ProviderTuple<any>[];

const initialComponent: React.FC<PropsWithChildren> = ({ children }) =>
  children as React.ReactElement;

export function buildProvidersTree<T extends ProvidersArray>(
  componentsWithProps: T
): React.FC<PropsWithChildren> {
  return componentsWithProps.reduce((AccumulatedComponents, Provider, idx) => {
    const WrappedComponent: React.FC<PropsWithChildren> = ({ children }) => {
      const [Component, props = {}, ChildComponent] = Array.isArray(Provider)
        ? Provider
        : [Provider];

      return (
        <AccumulatedComponents>
          <Component {...(props as object)}>{children}</Component>
          {ChildComponent ? <ChildComponent /> : null}
        </AccumulatedComponents>
      );
    };
    WrappedComponent.displayName = `BuildProvidersTreeProvider${idx}`;
    return WrappedComponent;
  }, initialComponent);
}
