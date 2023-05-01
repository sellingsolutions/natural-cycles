import ReactDOM from "react-dom";

interface PortalProps {
  /**
   * The container into which the children of the portal should be mounted.
   */
  container?: HTMLElement;

  children?: React.ReactNode;
}

/**
 * Creates a React portal that renders its children into the given container.
 * Portals are useful for "breaking out" of the DOM tree, e.g. to circumvent
 * a container with `overflow: hidden`, without disrupting React's data and
 * event flow.
 */
export const Portal: React.FC<PortalProps> = ({ container, children }) => {
  return ReactDOM.createPortal(children, container ?? document.body);
};
