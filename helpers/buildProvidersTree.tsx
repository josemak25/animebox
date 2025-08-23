import React, { PropsWithChildren, ComponentType } from "react";

// Strongly typed provider tuple
type ProviderTuple<P = unknown> =
  | ComponentType<PropsWithChildren<P>>
  | [ComponentType<PropsWithChildren<P>>, P];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ProvidersArray = ProviderTuple<any>[];

const initialComponent: React.FC<PropsWithChildren> = ({ children }) =>
  children as React.ReactElement;

export function buildProvidersTree<T extends ProvidersArray>(
  componentsWithProps: T
): React.FC<PropsWithChildren> {
  return componentsWithProps.reduce((AccumulatedComponents, Provider, idx) => {
    const WrappedComponent: React.FC<PropsWithChildren> = ({ children }) => {
      const [Component, props = {}] = Array.isArray(Provider)
        ? Provider
        : [Provider];

      return (
        <AccumulatedComponents>
          <Component {...(props as object)}>{children}</Component>
        </AccumulatedComponents>
      );
    };
    WrappedComponent.displayName = `BuildProvidersTreeProvider${idx}`;
    return WrappedComponent;
  }, initialComponent);
}
